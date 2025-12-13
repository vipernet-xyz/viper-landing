
'use client'

import React from 'react'
import { Search, Plus } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { ChainCard } from '@/components/dashboard/chains/ChainCard'

const chains = [
    {
        name: 'Ethereum',
        description: 'The decentralized L1',
        icon: '/assets/chains/ethereum.svg', // We'll need to check if these exist or use placeholders
        status: 'active' as const,
        type: 'tunnel' as const
    },
    {
        name: 'Solana',
        description: 'Fast, low-cost network for digital assets',
        icon: '/assets/chains/solana.svg',
        status: 'active' as const,
        type: 'tunnel' as const
    },
    {
        name: 'Polygon',
        description: 'Low-fees, high-throughput',
        icon: '/assets/chains/polygon.svg',
        status: 'active' as const,
        type: 'tunnel' as const
    },
    {
        name: 'Sui',
        description: 'Network with ease of web2',
        icon: '/assets/chains/sui.svg',
        status: 'active' as const,
        type: 'tunnel' as const
    }
]

export default function ChainsPage() {
    return (
        <div className="space-y-8 max-w-7xl mx-auto">
            <div className="space-y-1">
                <h1 className="text-2xl font-medium text-white">Chains</h1>
                {/* Breadcrumb could go here if needed */}
            </div>

            {/* Banner */}
            <div className="relative overflow-hidden rounded-xl bg-gradient-to-r from-[#1A1A1A] via-[#1A1A1A] to-[#252525] border border-white/10 p-8">
                <div className="relative z-10 max-w-2xl space-y-4">
                    <h2 className="text-3xl font-medium text-white">Root Network is Live!</h2>
                    <p className="text-white/60 text-sm leading-relaxed max-w-lg">
                        More than just a blockchain, The Root Network enables seamless user experience and asset interoperability across open metaverse.
                    </p>
                    <Button
                        variant="secondary"
                        className="bg-white text-black hover:bg-white/90 font-medium px-6"
                    >
                        Enable &gt;
                    </Button>
                </div>
                {/* decorative background elements could go here */}
            </div>

            {/* Controls */}
            <div className="flex items-center justify-between gap-4">
                <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40" />
                    <Input
                        placeholder="Search Chain"
                        className="pl-10 bg-[#111111] border-white/10 text-white placeholder:text-white/40 h-10"
                    />
                </div>
                <Button className="bg-white text-black hover:bg-white/90 gap-2 h-10 px-4">
                    <Plus className="h-4 w-4" />
                    Request Chain
                </Button>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {chains.map((chain) => (
                    <ChainCard
                        key={chain.name}
                        {...chain}
                    />
                ))}
            </div>
        </div>
    )
}
