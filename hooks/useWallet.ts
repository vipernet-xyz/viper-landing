'use client'

import { useAuth } from '@/components/auth/AuthProvider'
import { useChain } from '@cosmos-kit/react'

/**
 * Unified wallet hook for both EVM (Web3Auth) and Cosmos (Cosmos Kit)
 */
export function useWallet() {
    // EVM wallet (Web3Auth)
    const evmWallet = useAuth()

    // Cosmos wallet (Cosmos Kit) - defaults to cosmoshub
    const cosmosWallet = useChain('cosmoshub')

    return {
        // EVM (Ethereum, Polygon, BSC, etc.)
        evm: {
            provider: evmWallet.provider,
            user: evmWallet.user,
            isLoading: evmWallet.isLoading,
            login: evmWallet.login,
            logout: evmWallet.logout,
            getUserInfo: evmWallet.getUserInfo,
        },
        // Cosmos (Cosmos Hub, Osmosis, Juno, etc.)
        cosmos: {
            address: cosmosWallet.address,
            username: cosmosWallet.username,
            isWalletConnected: cosmosWallet.isWalletConnected,
            connect: cosmosWallet.connect,
            disconnect: cosmosWallet.disconnect,
            openView: cosmosWallet.openView,
            wallet: cosmosWallet.wallet,
            chain: cosmosWallet.chain,
        },
    }
}

/**
 * Hook for specific Cosmos chain
 * @param chainName - Name of the chain (e.g., 'osmosis', 'juno', 'stargaze')
 */
export function useCosmosChain(chainName: string) {
    return useChain(chainName)
}
