
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
    return (
        <Card className="bg-[#111111] border-white/5 p-6 flex flex-col gap-4 hover:border-white/10 transition-colors">
            <div className="flex items-start justify-between">
                <div className="size-12 rounded-full bg-white/5 flex items-center justify-center p-2.5">
                    {icon ? (
                        <span className="text-2xl">{icon}</span>
                    ) : (
                        <span className="text-xl font-bold text-white">{name.charAt(0)}</span>
                    )}
                </div>
            </div>

            <div className="space-y-1">
                <h3 className="text-lg font-medium text-white">{name}</h3>
                <p className="text-sm text-white/50">{description}</p>
            </div>

            <div className="mt-auto flex items-center gap-3 pt-2">
                <div className="flex items-center gap-2 px-3 py-1.5 rounded bg-[#1A1A1A] border border-white/5">
                    <div className={`size-1.5 rounded-full ${status === 'active' ? 'bg-[#4ADE80]' : 'bg-red-500'}`} />
                    <span className="text-xs font-medium text-white/70 capitalize">
                        {status}
                    </span>
                </div>

                <div className="flex items-center gap-2 px-3 py-1.5 rounded bg-[#1A1A1A] border border-white/5">
                    <div className="size-1.5 rounded-full bg-[#4ADE80]" />
                    <span className="text-xs font-medium text-white/70 capitalize">
                        {type}
                    </span>
                </div>
            </div>
        </Card>
    )
}
