'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ChevronRight } from 'lucide-react'
import Image from 'next/image'
import { useQuery } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'

interface NetworkStats {
    total_relays: number
    total_chains: number
    monthly_active_users: number
    availability: number
    total_nodes: number
}

export function DashboardStats() {
    const router = useRouter()

    const { data: stats, isLoading } = useQuery<NetworkStats>({
        queryKey: ['network-stats'],
        queryFn: async () => {
            const res = await fetch('/api/stats/network')
            if (!res.ok) throw new Error('Failed to fetch network stats')
            return res.json()
        },
        refetchInterval: 60000, // Refetch every minute
    })

    const formatNumber = (num: number) => {
        if (num >= 1000000) {
            return `${(num / 1000000).toFixed(1)}M+`
        } else if (num >= 1000) {
            return `${(num / 1000).toFixed(1)}k+`
        }
        return num.toString()
    }

    return (
        <div
            className="relative overflow-hidden rounded-[10px] min-h-[334px]"
            style={{
                backgroundImage: 'url(/assets/backgrounds/stats-bg.svg)',
                backgroundSize: 'cover',
                backgroundPosition: 'center'
            }}
        >
            {/* Header */}
            <div className="relative p-6 pb-4">
                <div className="flex items-center justify-between">
                    <h3 className="text-white text-[15px] font-normal">About Viper Network</h3>
                    <Button
                        size="sm"
                        className="h-7 px-3 text-[11px] font-medium bg-viper-purple hover:bg-viper-purple-dark text-white border-0 rounded gap-1"
                        onClick={() => router.push('/dashboard/apps')}
                    >
                        Apps
                        <ChevronRight className="size-3" strokeWidth={2} />
                    </Button>
                </div>
            </div>

            <div className="relative px-6 pb-6">
                <div className="grid grid-cols-12 gap-4">
                    {/* Left Column Stats */}
                    <div className="col-span-7 grid grid-cols-2 gap-4">
                        {/* Large Stat - Total Relays */}
                        <div className="col-span-2 p-6 rounded-[10px] bg-[rgba(37,37,37,0.5)] backdrop-blur-sm">
                            <div className="text-[30px] font-normal text-white mb-2 font-['Space_Grotesk']">
                                {isLoading ? '...' : formatNumber(stats?.total_relays || 0)}
                            </div>
                            <div className="text-[11px] text-white/70 font-normal mt-auto">Total Relays Serviced</div>
                        </div>

                        {/* Bottom Row - Availability and Chains */}
                        <div className="p-4 rounded-[10px] bg-[rgba(37,37,37,0.5)] backdrop-blur-sm flex flex-col">
                            <div className="text-xl font-normal text-white font-['Space_Grotesk']">
                                {isLoading ? '...' : `${stats?.availability || 99.999}%`}
                            </div>
                            <div className="text-[10px] text-white/70 font-normal mt-auto">Availability</div>
                        </div>
                        <div className="p-4 rounded-[10px] bg-[rgba(37,37,37,0.5)] backdrop-blur-sm flex flex-col">
                            <div className="text-xl font-normal text-white font-['Space_Grotesk']">
                                {isLoading ? '...' : stats?.total_chains || 0}
                            </div>
                            <div className="text-[10px] text-white/70 font-normal mt-auto">Chains Supported</div>
                        </div>
                    </div>

                    {/* Middle Column Stats */}
                    <div className="col-span-3 space-y-4">
                        <div className="p-5 rounded-[10px] bg-[rgba(37,37,37,0.5)] backdrop-blur-sm">
                            <div className="text-[30px] font-normal text-white mb-1 font-['Space_Grotesk']">
                                {isLoading ? '...' : formatNumber(stats?.monthly_active_users || 0)}
                            </div>
                            <div className="text-[11px] text-white/70 font-normal">Monthly Active Users</div>
                        </div>
                        <div className="p-5 rounded-[10px] bg-[rgba(37,37,37,0.5)] backdrop-blur-sm">
                            <div className="text-[30px] font-normal text-white mb-1 font-['Space_Grotesk']">
                                {isLoading ? '...' : formatNumber(stats?.total_nodes || 0)}
                            </div>
                            <div className="text-[11px] text-white/70 font-normal">Total Nodes</div>
                        </div>
                    </div>

                    {/* Right Column - Connect CTA */}
                    <div className="col-span-2 bg-[rgba(37,37,37,0.5)] rounded-[10px] p-6 flex flex-col justify-between relative overflow-hidden">
                        <div className="flex items-center justify-center flex-1 py-4">
                            <div className="relative size-24">
                                <Image 
                                    src="/assets/viper-illustration.png" 
                                    alt="Viper Network" 
                                    width={96} 
                                    height={96}
                                    className="object-contain opacity-80"
                                />
                            </div>
                        </div>

                        <div className="relative z-10">
                            <h4 className="text-xl font-medium text-white mb-2">Connect To Viper</h4>
                            <p className="text-[11px] text-white/60 leading-relaxed font-normal">
                                Get fast, reliable RPC relays across multiple blockchains with a single integration.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}