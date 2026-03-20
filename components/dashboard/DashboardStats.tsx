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
            const res = await fetch('/api/stats/network', { credentials: 'include' })
            if (!res.ok) throw new Error('Failed to fetch network stats')
            return res.json()
        },
        refetchInterval: 60000, // Refetch every minute
        retry: false, // Don't retry on failure
        // Return mock data on error
        placeholderData: {
            total_relays: 0,
            total_chains: 0,
            monthly_active_users: 0,
            availability: 99.999,
            total_nodes: 0,
        }
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
            className="relative rounded-[12px] w-full"
            style={{
                backgroundImage: 'url(/assets/backgrounds/stats-bg.svg)',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundColor: 'rgba(20, 20, 20, 0.95)'
            }}
        >
            {/* Header */}
            <div className="relative p-5 pb-3 z-10">
                <div className="flex items-center justify-between">
                    <h3 className="text-white text-base font-medium">About Viper Network</h3>
                    <Button
                        size="sm"
                        className="h-8 px-3 text-xs font-medium bg-viper-purple hover:bg-viper-purple-dark text-white border-0 rounded-lg gap-1 cursor-pointer transition-all duration-200"
                        onClick={() => router.push('/dashboard/apps')}
                    >
                        Apps
                        <ChevronRight className="size-3.5" strokeWidth={2} />
                    </Button>
                </div>
            </div>

            <div className="relative px-5 pb-5 z-10">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-3">
                    {/* Left Column Stats */}
                    <div className="lg:col-span-5 grid grid-cols-2 gap-3">
                        {/* Large Stat - Total Relays */}
                        <div className="col-span-1 p-4 rounded-[10px] bg-[rgba(37,37,37,0.6)] backdrop-blur-sm">
                            <div className="text-2xl font-normal text-white mb-1 font-['Space_Grotesk']">
                                {isLoading ? '...' : formatNumber(stats?.total_relays || 0)}
                            </div>
                            <div className="text-[10px] text-white/60 font-normal">Total Relays Serviced</div>
                        </div>

                        {/* Monthly Active Users */}
                        <div className="col-span-1 p-4 rounded-[10px] bg-[rgba(37,37,37,0.6)] backdrop-blur-sm">
                            <div className="text-2xl font-normal text-white mb-1 font-['Space_Grotesk']">
                                {isLoading ? '...' : formatNumber(stats?.monthly_active_users || 0)}
                            </div>
                            <div className="text-[10px] text-white/60 font-normal">Monthly Active Users</div>
                        </div>

                        {/* Bottom Row - Availability and Chains */}
                        <div className="p-3 rounded-[10px] bg-[rgba(37,37,37,0.6)] backdrop-blur-sm flex flex-col h-[72px]">
                            <div className="text-base font-normal text-white font-['Space_Grotesk']">
                                {isLoading ? '...' : `${stats?.availability || 99.999}%`}
                            </div>
                            <div className="text-[10px] text-white/60 font-normal mt-auto">Availability</div>
                        </div>
                        <div className="p-3 rounded-[10px] bg-[rgba(37,37,37,0.6)] backdrop-blur-sm flex flex-col h-[72px]">
                            <div className="text-base font-normal text-white font-['Space_Grotesk']">
                                {isLoading ? '...' : stats?.total_chains || 0}
                            </div>
                            <div className="text-[10px] text-white/60 font-normal mt-auto">Chains Supported</div>
                        </div>
                    </div>

                    {/* Middle Column - Total Nodes */}
                    <div className="lg:col-span-3 flex flex-col gap-3">
                        <div className="p-4 rounded-[10px] bg-[rgba(37,37,37,0.6)] backdrop-blur-sm flex-1 flex flex-col justify-between">
                            <div className="text-2xl font-normal text-white mb-1 font-['Space_Grotesk']">
                                {isLoading ? '...' : formatNumber(stats?.total_nodes || 0)}
                            </div>
                            <div className="text-[10px] text-white/60 font-normal">Total Nodes</div>
                        </div>
                    </div>

                    {/* Right Column - Connect CTA */}
                    <div className="lg:col-span-4 bg-gradient-to-br from-[rgba(37,37,37,0.6)] to-[rgba(60,37,80,0.4)] rounded-[10px] p-5 flex flex-col justify-between relative overflow-hidden">
                        <div className="flex items-center justify-center flex-1">
                            <div className="relative size-16">
                                <Image
                                    src="/assets/viper-illustration.png"
                                    alt="Viper Network"
                                    width={64}
                                    height={64}
                                    className="object-contain opacity-80"
                                />
                            </div>
                        </div>

                        <div className="relative z-10">
                            <h4 className="text-base font-medium text-white mb-1.5">Connect To Viper</h4>
                            <p className="text-[11px] text-white/50 leading-relaxed font-normal">
                                Get fast, reliable RPC relays across multiple blockchains with a single integration.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}