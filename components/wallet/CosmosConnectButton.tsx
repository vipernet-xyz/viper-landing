'use client'

import { Button } from '@/components/ui/button'
import { Wallet } from 'lucide-react'
import dynamic from 'next/dynamic'

interface CosmosConnectButtonProps {
    className?: string
}

// Dynamically import the actual button to avoid SSR issues
const CosmosConnectButtonClient = dynamic(
    () => import('./CosmosConnectButtonClient').then(mod => mod.CosmosConnectButtonClient),
    {
        ssr: false,
        loading: () => (
            <Button className="w-full" disabled>
                <Wallet className="w-4 h-4 mr-2" />
                Cosmos Wallet
            </Button>
        )
    }
)

export function CosmosConnectButton({ className }: CosmosConnectButtonProps) {
    return <CosmosConnectButtonClient className={className} />
}
