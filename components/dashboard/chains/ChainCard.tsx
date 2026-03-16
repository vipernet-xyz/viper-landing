
import React from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

interface ChainCardProps {
    name: string
    description: string
    icon: string
    status?: 'active' | 'inactive'
    type?: 'tunnel' | 'bridge'
}

export function ChainCard({
    name,
    description,
    icon,
    status = 'active',
    type = 'tunnel'
}: ChainCardProps) {
    const chain = { name }
    return (
        <Card className="bg-[#111111] border-white/5 flex flex-col hover:border-white/10 transition-colors overflow-hidden">
            <div className="h-32 rounded-t-xl bg-gradient-to-br from-[#2a1f5e] to-[#1a1040] relative overflow-hidden">
                {/* Chain logo in top-right */}
                <div className="absolute top-3 right-3 h-8 w-8 rounded-full bg-white/10 flex items-center justify-center text-xs text-white/70">
                    {chain.name?.[0] || '?'}
                </div>
            </div>

            <div className="p-4">
                <h3 className="text-lg font-medium text-white">{name}</h3>
            </div>
        </Card>
    )
}
