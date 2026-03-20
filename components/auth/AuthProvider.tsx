'use client'

import { createContext, useContext, useEffect, useRef, useState, ReactNode } from 'react'
import { useChain } from '@cosmos-kit/react'

type Web3Auth = any

function normalizeUser(user: any) {
    if (!user) {
        return null
    }

    return {
        ...user,
        verifierId: user.verifierId ?? user.provider_user_id ?? null,
    }
}

function mergeUsers(currentUser: any, nextUser: any) {
    if (!nextUser) {
        return currentUser
    }

    return {
        ...(currentUser ?? {}),
        ...normalizeUser(nextUser),
    }
}

interface AuthContextType {
    web3auth: Web3Auth | null
    provider: any | null
    user: any | null
    isLoading: boolean
    authError: string | null
    login: () => Promise<void>
    logout: () => Promise<void>
    getUserInfo: () => Promise<any>
}

const AuthContext = createContext<AuthContextType>({
    web3auth: null,
    provider: null,
    user: null,
    isLoading: true,
    authError: null,
    login: async () => { },
    logout: async () => { },
    getUserInfo: async () => { },
})

export const useAuth = () => useContext(AuthContext)

interface AuthProviderProps {
    children: ReactNode
}

const clientId = process.env.NEXT_PUBLIC_WEB3AUTH_CLIENT_ID

export const AuthProvider = ({ children }: AuthProviderProps) => {
    const [web3auth, setWeb3auth] = useState<Web3Auth | null>(null)
    const [provider, setProvider] = useState<any | null>(null)
    const [user, setUser] = useState<any | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [authError, setAuthError] = useState<string | null>(null)
    const {
        isWalletConnected: cosmosConnected,
        address: cosmosAddress,
        disconnect: disconnectCosmos,
        getAccount,
        signArbitrary,
    } = useChain('cosmoshub')
    const cosmosSyncAddressRef = useRef<string | null>(null)

    const syncUserWithBackend = async (payload: Record<string, unknown>, userFields: Record<string, unknown> = {}) => {
        try {
            const res = await fetch('/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include',
                body: JSON.stringify(payload)
            })

            if (!res.ok) {
                const errorBody = await res.json().catch(() => null)
                console.error('Failed to sync user with backend', errorBody)
                return null
            }

            const data = await res.json()
            if (data.user) {
                setUser((currentUser: any) => mergeUsers(currentUser, {
                    ...data.user,
                    ...userFields,
                }))
            }

            return data.user ?? null
        } catch (e) {
            console.error('Error syncing user:', e)
            return null
        }
    }

    useEffect(() => {
        let isMounted = true

        const hydrateSession = async () => {
            try {
                const res = await fetch('/api/auth/me', {
                    credentials: 'include',
                })

                if (!res.ok) {
                    return null
                }

                const data = await res.json()
                if (isMounted && data.user) {
                    setUser((currentUser: any) => mergeUsers(currentUser, data.user))
                }
                return data.user ?? null
            } catch (error) {
                console.error('Failed to restore session:', error)
                return null
            }
        }

        const initWeb3Auth = async () => {
            if (typeof window === 'undefined') {
                return
            }

            if (!clientId) {
                if (isMounted) {
                    setAuthError('Google sign-in is unavailable because NEXT_PUBLIC_WEB3AUTH_CLIENT_ID is missing.')
                }
                return
            }

            try {
                const { Web3Auth, WEB3AUTH_NETWORK } = await import('@web3auth/modal')

                const web3authInstance = new Web3Auth({
                    clientId,
                    web3AuthNetwork: WEB3AUTH_NETWORK.SAPPHIRE_MAINNET,
                })

                await web3authInstance.initModal()

                if (!isMounted) {
                    return
                }

                setWeb3auth(web3authInstance as Web3Auth)
                setAuthError(null)

                if (web3authInstance.connected) {
                    const userInfo = normalizeUser(await web3authInstance.getUserInfo())

                    const authInfo = await web3authInstance.authenticateUser().catch((error: unknown) => {
                        console.error('Failed to authenticate existing Web3Auth session:', error)
                        return null
                    })

                    if (authInfo?.idToken) {
                        const syncedUser = await syncUserWithBackend(
                            {
                                provider: 'web3auth',
                                idToken: authInfo.idToken,
                                userInfo,
                            },
                            {
                                verifier: userInfo?.verifier,
                                typeOfLogin: userInfo?.typeOfLogin,
                            }
                        )

                        if (syncedUser) {
                            setProvider(web3authInstance.provider)
                        } else {
                            setUser(null)
                            setProvider(null)
                            setAuthError('Google sign-in was restored, but the server session could not be verified. Please sign in again.')
                        }
                    } else {
                        setUser(null)
                        setProvider(null)
                    }
                }
            } catch (error) {
                if (!isMounted) {
                    return
                }

                console.error('Failed to initialize Web3Auth:', error)
                setWeb3auth(null)
                setAuthError('Google sign-in is temporarily unavailable. Refresh to retry or use a Cosmos wallet.')
            }
        }

        const init = async () => {
            const initWeb3AuthPromise = initWeb3Auth()
            const restoredUser = await hydrateSession()

            if (!restoredUser) {
                await initWeb3AuthPromise
            }

            if (isMounted) {
                setIsLoading(false)
            }
        }

        init()

        return () => {
            isMounted = false
        }
    }, [])

    useEffect(() => {
        if (!cosmosConnected || !cosmosAddress) {
            cosmosSyncAddressRef.current = null
            return
        }

        if (user || cosmosSyncAddressRef.current === cosmosAddress) {
            return
        }

        cosmosSyncAddressRef.current = cosmosAddress

        const syncCosmosSession = async () => {
            try {
                const challengeRes = await fetch('/api/auth/challenge', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    credentials: 'include',
                    body: JSON.stringify({
                        provider: 'cosmos',
                        address: cosmosAddress,
                    }),
                })

                if (!challengeRes.ok) {
                    console.error('Failed to request Cosmos auth challenge')
                    cosmosSyncAddressRef.current = null
                    return
                }

                const challengeData = await challengeRes.json()
                const signature = await signArbitrary(cosmosAddress, challengeData.message)
                const account = await getAccount()
                const fallbackPubKey =
                    account?.pubkey instanceof Uint8Array
                        ? btoa(String.fromCharCode(...account.pubkey))
                        : undefined

                const syncedUser = await syncUserWithBackend(
                    {
                        provider: 'cosmos',
                        address: cosmosAddress,
                        challengeToken: challengeData.challengeToken,
                        signature: {
                            ...signature,
                            pub_key: signature?.pub_key?.value
                                ? signature.pub_key
                                : fallbackPubKey
                                    ? {
                                        type: 'tendermint/PubKeySecp256k1',
                                        value: fallbackPubKey,
                                    }
                                    : undefined,
                        },
                    },
                    {
                        verifier: 'cosmos',
                        typeOfLogin: 'cosmos',
                    }
                )

                if (!syncedUser) {
                    cosmosSyncAddressRef.current = null
                }
            } catch (error) {
                console.error('Failed to sync Cosmos wallet with backend:', error)
                cosmosSyncAddressRef.current = null
            }
        }

        void syncCosmosSession()
    }, [cosmosAddress, cosmosConnected, getAccount, signArbitrary, user])

    const login = async () => {
        if (!web3auth) {
            setAuthError('Google sign-in is not ready yet. Refresh to retry or use a Cosmos wallet.')
            return
        }

        try {
            const web3authProvider = await web3auth.connect()
            setAuthError(null)

            if (web3auth.connected) {
                const userInfo = normalizeUser(await web3auth.getUserInfo())
                const authInfo = await web3auth.authenticateUser()

                if (!authInfo?.idToken) {
                    await web3auth.logout().catch(() => undefined)
                    setProvider(null)
                    setUser(null)
                    setAuthError('Google sign-in did not return a valid identity token. Please try again.')
                    return
                }

                const syncedUser = await syncUserWithBackend(
                    {
                        provider: 'web3auth',
                        idToken: authInfo.idToken,
                        userInfo,
                    },
                    {
                        verifier: userInfo?.verifier,
                        typeOfLogin: userInfo?.typeOfLogin,
                    }
                )

                if (!syncedUser) {
                    await web3auth.logout().catch(() => undefined)
                    setProvider(null)
                    setUser(null)
                    setAuthError('Google sign-in succeeded, but the server session could not be created. Please try again.')
                    return
                }

                setProvider(web3authProvider)
            }
        } catch (error) {
            console.error('Login failed:', error)
            setAuthError('Unable to complete Google sign-in. Please try again.')
        }
    }

    const logout = async () => {
        cosmosSyncAddressRef.current = cosmosAddress || '__logout__'

        try {
            await Promise.allSettled([
                web3auth?.connected ? web3auth.logout() : Promise.resolve(),
                cosmosConnected ? Promise.resolve(disconnectCosmos()) : Promise.resolve(),
                fetch('/api/auth/logout', { method: 'POST', credentials: 'include' }),
            ])
        } finally {
            setProvider(null)
            setUser(null)
            setAuthError(null)
        }
    }

    const getUserInfo = async () => {
        if (!web3auth) {
            return user
        }

        const nextUser = normalizeUser(await web3auth.getUserInfo())
        setUser((currentUser: any) => mergeUsers(currentUser, nextUser))
        return nextUser
    }

    return (
        <AuthContext.Provider value={{ web3auth, provider, user, isLoading, authError, login, logout, getUserInfo }}>
            {children}
        </AuthContext.Provider>
    )
}
