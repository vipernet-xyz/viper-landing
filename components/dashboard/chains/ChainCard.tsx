
import React from 'react'

interface ChainCardProps {
    name: string
    description: string
    icon: string
    status?: 'active' | 'inactive'
    type?: 'tunnel' | 'bridge'
    tags?: string[]
    onClick?: () => void
}

const CHAIN_GRADIENTS: Record<string, string> = {
    Ethereum: 'from-[#2a1f5e] to-[#1a1040]',
    Solana: 'from-[#1a3a4a] to-[#0f2030]',
    Polygon: 'from-[#2d1a4e] to-[#1a1040]',
    Sui: 'from-[#1a2a4e] to-[#0f1a30]',
    Avalanche: 'from-[#3a1a1a] to-[#1a0f0f]',
    Arbitrum: 'from-[#1a2a3e] to-[#0f1520]',
    Optimism: 'from-[#3a1a1a] to-[#200f0f]',
    Base: 'from-[#1a2a4e] to-[#0f1530]',
}

export function ChainCard({
    name,
    description,
    icon,
    status = 'active',
    type = 'tunnel',
    tags = ['Mainnet', 'Testnet'],
    onClick,
}: ChainCardProps) {
    const gradient = CHAIN_GRADIENTS[name] || 'from-[#2a1f5e] to-[#1a1040]'

    return (
        <div
            className="group rounded-xl bg-[#111111] border border-white/5 hover:border-white/15 transition-all duration-200 overflow-hidden cursor-pointer"
            onClick={onClick}
        >
            <div className={`h-28 bg-gradient-to-br ${gradient} relative overflow-hidden flex items-center justify-center`}>
                <div className="flex items-center justify-center size-12 rounded-full bg-white/10 text-white text-lg font-bold">
                    {name[0]}
                </div>
            </div>

            <div className="p-4 space-y-2">
                <h3 className="text-[15px] font-medium text-white">{name}</h3>
                <p className="text-[11px] text-white/50 leading-relaxed">{description}</p>
                <div className="flex items-center gap-1.5 pt-1">
                    {tags.map((tag) => (
                        <span
                            key={tag}
                            className="px-2 py-0.5 rounded text-[9px] font-medium bg-[#7f5ee3]/20 text-[#b89aff]"
                        >
                            {tag}
                        </span>
                    ))}
                </div>
            </div>
        </div>
    )
}
