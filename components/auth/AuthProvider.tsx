'use client'

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import type { IProvider } from '@web3auth/base'

// Dynamic imports to avoid SSR issues
type Web3Auth = any
type MetamaskAdapter = any

interface AuthContextType {
    web3auth: Web3Auth | null
    provider: IProvider | null
    user: any | null
    isLoading: boolean
    login: () => Promise<void>
    logout: () => Promise<void>
    getUserInfo: () => Promise<any>
}

const AuthContext = createContext<AuthContextType>({
    web3auth: null,
    provider: null,
    user: null,
    isLoading: true,
    login: async () => { },
    logout: async () => { },
    getUserInfo: async () => { },
})

export const useAuth = () => useContext(AuthContext)

interface AuthProviderProps {
    children: ReactNode
}

const clientId = process.env.NEXT_PUBLIC_WEB3AUTH_CLIENT_ID || 'test-client-id'
console.log('Web3Auth Client ID:', clientId, 'Env:', process.env.NEXT_PUBLIC_WEB3AUTH_CLIENT_ID)

const getChainConfig = () => ({
    chainNamespace: 'eip155',
    chainId: '0x1', // Please use 0x1 for Mainnet
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

    useEffect(() => {
        const init = async () => {
            // Only run on client side
            if (typeof window === 'undefined') {
                setIsLoading(false)
                return
            }

            try {
                // Dynamic imports to avoid SSR issues
                const { Web3Auth } = await import('@web3auth/modal')
                const { CHAIN_NAMESPACES, WEB3AUTH_NETWORK } = await import('@web3auth/base')
                const { EthereumPrivateKeyProvider } = await import('@web3auth/ethereum-provider')
                const { MetamaskAdapter } = await import('@web3auth/metamask-adapter')

                const chainConfig = getChainConfig()
                const privateKeyProvider = new EthereumPrivateKeyProvider({
                    config: {
                        chainConfig: chainConfig as any
                    }
                })

                const web3authInstance = new Web3Auth({
                    clientId,
                    web3AuthNetwork: WEB3AUTH_NETWORK.SAPPHIRE_MAINNET,
                    privateKeyProvider,
                })

                const metamaskAdapter = new MetamaskAdapter({
                    clientId,
                    sessionTime: 3600, // 1 hour in seconds
                    web3AuthNetwork: WEB3AUTH_NETWORK.SAPPHIRE_MAINNET,
                    chainConfig: {
                        chainNamespace: CHAIN_NAMESPACES.EIP155,
                        chainId: '0x1',
                        rpcTarget: 'https://eth.llamarpc.com',
                    },
                })

                web3authInstance.configureAdapter(metamaskAdapter)

                try {
                    await web3authInstance.initModal()
                    setWeb3auth(web3authInstance as unknown as Web3Auth)
                } catch (initError) {
                    console.error('Failed to initialize Web3Auth modal:', initError)
                    // Try to initialize without modal for basic functionality
                    setWeb3auth(web3authInstance as unknown as Web3Auth)
                }

                if (web3authInstance.connected) {
                    setProvider(web3authInstance.provider)
                    const userInfo = await web3authInstance.getUserInfo()
                    setUser(userInfo)
                }
            } catch (error) {
                console.error(error)
            } finally {
                setIsLoading(false)
            }
        }

        init()
    }, [])

    const login = async () => {
        if (!web3auth) {
            console.log('web3auth not initialized yet')
            return
        }
        const web3authProvider = await web3auth.connect()
        setProvider(web3authProvider)
        if (web3auth.connected) {
            const userInfo = await web3auth.getUserInfo()
            setUser(userInfo)

            // TODO: Call API to create/verify user in DB
            await syncUserWithBackend(userInfo)
        }
    }

    const syncUserWithBackend = async (userInfo: any) => {
        try {
            const res = await fetch('/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ userInfo })
            })
            if (!res.ok) {
                console.error('Failed to sync user with backend')
            }
        } catch (e) {
            console.error('Error syncing user:', e)
        }
    }

    const logout = async () => {
        if (!web3auth) {
            console.log('web3auth not initialized yet')
            return
        }
        await web3auth.logout()
        setProvider(null)
        setUser(null)

        // Clear cookie via API
        await fetch('/api/auth/logout', { method: 'POST' })
    }

    const getUserInfo = async () => {
        if (!web3auth) {
            console.log('web3auth not initialized yet')
            return
        }
        const user = await web3auth.getUserInfo()
        setUser(user)
        return user
    }

    return (
        <AuthContext.Provider value={{ web3auth, provider, user, isLoading, login, logout, getUserInfo }}>
            {children}
        </AuthContext.Provider>
    )
}
