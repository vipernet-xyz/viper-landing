
'use client'

import React from 'react'
import { Search, Plus, ChevronRight } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { ChainCard } from '@/components/dashboard/chains/ChainCard'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"

interface Chain {
    id: number
    name: string
    description: string
    icon: string
    status: 'active' | 'inactive'
    type: 'tunnel' | 'bridge'
    chainId?: string
    tags?: string[]
}

const DEFAULT_CHAINS: Chain[] = [
    { id: 1, name: 'Ethereum', description: 'The decentralized L1', icon: '/assets/chains/ethereum.png', status: 'active', type: 'tunnel', chainId: '0001', tags: ['Mainnet', 'Testnet'] },
    { id: 2, name: 'Solana', description: 'Fast, low-cost network for digital assets', icon: '/assets/chains/solana.png', status: 'active', type: 'tunnel', tags: ['Mainnet', 'Testnet'] },
    { id: 3, name: 'Polygon', description: 'Low-fee, high-throughput', icon: '/assets/chains/polygon.png', status: 'active', type: 'tunnel', tags: ['Mainnet', 'Testnet'] },
    { id: 4, name: 'Sui', description: 'Network with apps of web3', icon: '/assets/chains/sui.png', status: 'active', type: 'tunnel', tags: ['Mainnet', 'Testnet'] },
    { id: 5, name: 'Avalanche', description: 'Blazingly fast smart contracts', icon: '/assets/chains/avalanche.png', status: 'active', type: 'tunnel', tags: ['Mainnet'] },
    { id: 6, name: 'Arbitrum', description: 'Ethereum L2 scaling solution', icon: '/assets/chains/arbitrum.png', status: 'active', type: 'tunnel', tags: ['Mainnet'] },
    { id: 7, name: 'Optimism', description: 'Low-cost Ethereum L2', icon: '/assets/chains/optimism.png', status: 'active', type: 'tunnel', tags: ['Mainnet'] },
    { id: 8, name: 'Base', description: 'Built on the OP Stack', icon: '/assets/chains/base.png', status: 'active', type: 'tunnel', tags: ['Mainnet'] },
]

export default function ChainsPage() {
    const [chains, setChains] = React.useState<Chain[]>(DEFAULT_CHAINS)
    const [isLoading, setIsLoading] = React.useState(false)
    const [searchQuery, setSearchQuery] = React.useState('')
    const [isDialogOpen, setIsDialogOpen] = React.useState(false)

    React.useEffect(() => {
        async function fetchChains() {
            try {
                const response = await fetch('/api/chains', { credentials: 'include' })
                if (response.ok) {
                    const data = await response.json()
                    if (data.length > 0) setChains(data)
                }
            } catch (error) {
                console.error('Failed to fetch chains:', error)
            }
        }
        fetchChains()
    }, [])

    const filteredChains = chains.filter(chain =>
        chain.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        chain.description.toLowerCase().includes(searchQuery.toLowerCase())
    )

    const handleRequestChain = (e: React.FormEvent) => {
        e.preventDefault()
        // Here you would typically assume an API call
        toast.success("Request sent successfully", {
            description: "We'll review your request to add a new chain."
        })
        setIsDialogOpen(false)
    }

    return (
        <div className="space-y-8 max-w-7xl mx-auto">
            <div className="space-y-1">
                <h1 className="text-2xl font-medium text-white">Chains</h1>
                {/* Breadcrumb could go here if needed */}
            </div>

            {/* Banner */}
            <div className="relative overflow-hidden rounded-xl bg-gradient-to-r from-[#1a1040] via-[#1c1445] to-[#252060] border border-white/10 p-8">
                <div className="relative z-10 max-w-2xl space-y-4">
                    <h2 className="text-3xl font-medium text-white">Root Network is Live!</h2>
                    <p className="text-white/60 text-sm leading-relaxed max-w-lg">
                        More than just a blockchain, The Root Network enables seamless user experience and asset interoperability across open metaverse.
                    </p>
                    <Button
                        className="bg-white text-black hover:bg-white/90 font-medium px-5 h-9 rounded-lg text-sm gap-1"
                    >
                        Enable <ChevronRight className="h-3.5 w-3.5" />
                    </Button>
                </div>
                {/* decorative background elements could go here */}
            </div>

            {/* Controls */}
            <div className="flex items-center justify-between gap-4">
                <div className="relative w-[300px]">
                    <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/55" />
                    <Input
                        placeholder="Search Chain"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="h-10 pl-4 pr-10 bg-viper-bg-card border-white/10 rounded-lg text-sm text-white/60 placeholder:text-white/60"
                    />
                </div>

                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                        <Button className="h-10 px-5 bg-transparent hover:bg-white/5 text-white text-sm font-medium rounded-lg border border-white/20 gap-2">
                            <Plus className="h-4 w-4" />
                            Request Chain
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="bg-[#111111] border-white/10 text-white">
                        <DialogHeader>
                            <DialogTitle>Request a New Chain</DialogTitle>
                            <DialogDescription className="text-white/60">
                                Let us know which chain you would like to see supported.
                            </DialogDescription>
                        </DialogHeader>
                        <form onSubmit={handleRequestChain} className="space-y-4 pt-4">
                            <div className="space-y-2">
                                <Label htmlFor="chainName">Chain Name</Label>
                                <Input id="chainName" placeholder="e.g. Avalanche, Optimism" className="bg-[#1A1A1A] border-white/10" required />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="reason">Why do you need it?</Label>
                                <Input id="reason" placeholder="Brief explanation..." className="bg-[#1A1A1A] border-white/10" />
                            </div>
                            <div className="flex justify-end pt-2">
                                <Button type="submit" className="bg-white text-black hover:bg-white/90">
                                    Submit Request
                                </Button>
                            </div>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {isLoading ? (
                    // Skeleton loading state
                    [...Array(4)].map((_, i) => (
                        <div key={i} className="h-[200px] rounded-xl bg-white/5 animate-pulse" />
                    ))
                ) : (
                    filteredChains.map((chain) => (
                        <ChainCard
                            key={chain.id}
                            name={chain.name}
                            description={chain.description}
                            icon={chain.icon}
                            status={chain.status as 'active' | 'inactive'}
                            type={chain.type as 'tunnel' | 'bridge'}
                            tags={chain.tags}
                        />
                    ))
                )}
            </div>
        </div>
    )
}
