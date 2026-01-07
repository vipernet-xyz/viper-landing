'use client'

import { useChain } from '@cosmos-kit/react'
import { Button } from '@/components/ui/button'
import { Wallet, Loader2 } from 'lucide-react'

interface CosmosConnectButtonProps {
    className?: string
}

export function CosmosConnectButtonClient({ className }: CosmosConnectButtonProps) {
    const { connect, disconnect, isWalletConnected, isWalletConnecting, address, openView } = useChain('cosmoshub')

    const handleClick = () => {
        if (isWalletConnected) {
            openView()
        } else {
            connect()
        }
    }

    return (
        <Button
            onClick={handleClick}
            disabled={isWalletConnecting}
            className={className}
        >
            {isWalletConnecting ? (
                <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Connecting...
                </>
            ) : isWalletConnected ? (
                <>
                    <Wallet className="w-4 h-4 mr-2" />
                    {address?.substring(0, 8)}...{address?.substring(address.length - 6)}
                </>
            ) : (
                <>
                    <svg className="w-4 h-4 mr-2" viewBox="0 0 256 256" fill="currentColor">
                        <path d="M128 0C57.308 0 0 57.307 0 128s57.308 128 128 128 128-57.307 128-128S198.692 0 128 0zm0 230.4c-56.554 0-102.4-45.846-102.4-102.4S71.446 25.6 128 25.6s102.4 45.846 102.4 102.4-45.846 102.4-102.4 102.4z"/>
                        <circle cx="128" cy="128" r="76.8"/>
                    </svg>
                    Cosmos Wallet
                </>
            )}
        </Button>
    )
}
