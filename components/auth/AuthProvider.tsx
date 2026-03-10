'use client'

import { createContext, useContext, useEffect, useRef, useState, ReactNode } from 'react'
import { useChain } from '@cosmos-kit/react'
import type { IProvider } from '@web3auth/base'

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
    provider: IProvider | null
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

const getChainConfig = () => ({
    chainNamespace: 'eip155',
    chainId: '0x1',
    rpcTarget: 'https://eth.llamarpc.com',
    displayName: 'Ethereum Mainnet',
    blockExplorerUrl: 'https://etherscan.io/',
    ticker: 'ETH',
    tickerName: 'Ethereum',
    skipLookupNetworkData: true,
})

export const AuthProvider = ({ children }: AuthProviderProps) => {
    const [web3auth, setWeb3auth] = useState<Web3Auth | null>(null)
    const [provider, setProvider] = useState<IProvider | null>(null)
    const [user, setUser] = useState<any | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [authError, setAuthError] = useState<string | null>(null)
    const { isWalletConnected: cosmosConnected, address: cosmosAddress, disconnect: disconnectCosmos } = useChain('cosmoshub')
    const cosmosSyncAddressRef = useRef<string | null>(null)

    useEffect(() => {
        let isMounted = true

        const hydrateSession = async () => {
            try {
                const res = await fetch('/api/auth/me', {
                    credentials: 'include',
                })

                if (!res.ok) {
                    return
                }

                const data = await res.json()
                if (isMounted && data.user) {
                    setUser((currentUser: any) => mergeUsers(currentUser, data.user))
                }
            } catch (error) {
                console.error('Failed to restore session:', error)
            }
        }

        const initWeb3Auth = async () => {
            if (typeof window === 'undefined') {
                return
            }

            if (!clientId) {
                if (isMounted) {
                    setAuthError('Google sign-in is unavailable because NEXT_PUBLIC_WEB3AUTH_CLIENT_ID is missing.')
                    setIsLoading(false)
                }
                return
            }

            try {
                const { Web3Auth } = await import('@web3auth/modal')
                const { CHAIN_NAMESPACES, WEB3AUTH_NETWORK } = await import('@web3auth/base')
                const { EthereumPrivateKeyProvider } = await import('@web3auth/ethereum-provider')
                const { MetamaskAdapter } = await import('@web3auth/metamask-adapter')

                const privateKeyProvider = new EthereumPrivateKeyProvider({
                    config: {
                        chainConfig: getChainConfig() as any,
                    },
                })

                const web3authInstance = new Web3Auth({
                    clientId,
                    web3AuthNetwork: WEB3AUTH_NETWORK.SAPPHIRE_MAINNET,
                    privateKeyProvider,
                })

                const metamaskAdapter = new MetamaskAdapter({
                    clientId,
                    sessionTime: 3600,
                    web3AuthNetwork: WEB3AUTH_NETWORK.SAPPHIRE_MAINNET,
                    chainConfig: {
                        chainNamespace: CHAIN_NAMESPACES.EIP155,
                        chainId: '0x1',
                        rpcTarget: 'https://eth.llamarpc.com',
                    },
                })

                web3authInstance.configureAdapter(metamaskAdapter)
                await web3authInstance.initModal()

                if (!isMounted) {
                    return
                }

                setWeb3auth(web3authInstance as Web3Auth)
                setAuthError(null)

                if (web3authInstance.connected) {
                    setProvider(web3authInstance.provider)
                    const userInfo = normalizeUser(await web3authInstance.getUserInfo())
                    setUser((currentUser: any) => mergeUsers(currentUser, userInfo))
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
            await Promise.allSettled([
                hydrateSession(),
                initWeb3Auth(),
            ])

            if (isMounted) {
                setIsLoading(false)
            }
        }

        init()

        return () => {
            isMounted = false
        }
    }, [])

    const syncUserWithBackend = async (userInfo: any) => {
        try {
            if (!userInfo?.verifierId) {
                return null
            }

            const res = await fetch('/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include',
                body: JSON.stringify({ userInfo })
            })

            if (!res.ok) {
                console.error('Failed to sync user with backend')
                return null
            }

            const data = await res.json()
            if (data.user) {
                setUser((currentUser: any) => mergeUsers(currentUser, {
                    ...data.user,
                    verifier: userInfo.verifier,
                    typeOfLogin: userInfo.typeOfLogin,
                }))
            }

            return data.user ?? null
        } catch (e) {
            console.error('Error syncing user:', e)
            return null
        }
    }

    useEffect(() => {
        if (!cosmosConnected || !cosmosAddress) {
            cosmosSyncAddressRef.current = null
            return
        }

        if (user || cosmosSyncAddressRef.current === cosmosAddress) {
            return
        }

        cosmosSyncAddressRef.current = cosmosAddress

        void syncUserWithBackend({
            verifierId: cosmosAddress,
            verifier: 'cosmos',
            typeOfLogin: 'cosmos',
            name: `Cosmos ${cosmosAddress.slice(0, 8)}...${cosmosAddress.slice(-6)}`,
        })
    }, [cosmosAddress, cosmosConnected, user])

    const login = async () => {
        if (!web3auth) {
            setAuthError('Google sign-in is not ready yet. Refresh to retry or use a Cosmos wallet.')
            return
        }

        try {
            const web3authProvider = await web3auth.connect()
            setProvider(web3authProvider)
            setAuthError(null)

            if (web3auth.connected) {
                const userInfo = normalizeUser(await web3auth.getUserInfo())
                setUser((currentUser: any) => mergeUsers(currentUser, userInfo))
                await syncUserWithBackend(userInfo)
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
