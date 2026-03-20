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
            className="relative rounded-[12px] w-full overflow-hidden"
            style={{
                background: 'linear-gradient(135deg, rgba(40,20,80,0.9) 0%, rgba(80,40,140,0.6) 30%, rgba(120,60,200,0.3) 60%, rgba(20,20,20,0.95) 100%)',
            }}
        >
            {/* Top purple gradient glow */}
            <div className="absolute top-0 left-0 right-0 h-[120px] bg-gradient-to-b from-[rgba(127,94,227,0.3)] to-transparent pointer-events-none" />
            {/* Header */}
            <div className="relative p-6 pb-4 z-10">
                <h3 className="text-white text-[15px] font-medium">About Viper Network</h3>
            </div>

            <div className="relative px-6 pb-6 z-10">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-3">
                    {/* Left Column - Total Relays + Availability/Chains */}
                    <div className="lg:col-span-5 flex flex-col gap-3">
                        {/* Large Stat - Total Relays */}
                        <div className="p-6 rounded-[10px] bg-[rgba(37,37,37,0.5)] backdrop-blur-sm flex-1 flex flex-col justify-between min-h-[150px]">
                            <div className="text-[36px] font-normal text-white font-['Space_Grotesk'] leading-none">
                                {isLoading ? '...' : formatNumber(stats?.total_relays || 0)}
                            </div>
                            <div className="text-[12px] text-white/50 font-normal">Total Relays Serviced</div>
                        </div>

                        {/* Bottom Row - Availability and Chains */}
                        <div className="grid grid-cols-2 gap-3">
                            <div className="p-5 rounded-[10px] bg-[rgba(37,37,37,0.5)] backdrop-blur-sm flex flex-col justify-between min-h-[100px]">
                                <div className="text-[20px] font-normal text-white font-['Space_Grotesk']">
                                    {isLoading ? '...' : `${stats?.availability || 99.999}%`}
                                </div>
                                <div className="text-[11px] text-white/50 font-normal mt-auto">Availability</div>
                            </div>
                            <div className="p-5 rounded-[10px] bg-[rgba(37,37,37,0.5)] backdrop-blur-sm flex flex-col justify-between min-h-[100px]">
                                <div className="text-[20px] font-normal text-white font-['Space_Grotesk']">
                                    {isLoading ? '...' : stats?.total_chains || 0}
                                </div>
                                <div className="text-[11px] text-white/50 font-normal mt-auto">Chains Supported</div>
                            </div>
                        </div>
                    </div>

                    {/* Middle Column - Monthly Active Users + Total Nodes */}
                    <div className="lg:col-span-3 flex flex-col gap-3">
                        <div className="p-6 rounded-[10px] bg-[rgba(37,37,37,0.5)] backdrop-blur-sm flex-1 flex flex-col justify-between">
                            <div className="text-[32px] font-normal text-white font-['Space_Grotesk'] leading-none">
                                {isLoading ? '...' : formatNumber(stats?.monthly_active_users || 0)}
                            </div>
                            <div className="text-[12px] text-white/50 font-normal">Monthly Active Users</div>
                        </div>
                        <div className="p-6 rounded-[10px] bg-[rgba(37,37,37,0.5)] backdrop-blur-sm flex-1 flex flex-col justify-between">
                            <div className="text-[32px] font-normal text-white font-['Space_Grotesk'] leading-none">
                                {isLoading ? '...' : formatNumber(stats?.total_nodes || 0)}
                            </div>
                            <div className="text-[12px] text-white/50 font-normal">Total Nodes</div>
                        </div>
                    </div>

                    {/* Right Column - Connect CTA with Apps button */}
                    <div className="lg:col-span-4 bg-[rgba(30,30,30,0.6)] rounded-[10px] p-5 flex flex-col justify-between relative overflow-hidden">
                        <div className="flex justify-end mb-2">
                            <Button
                                size="sm"
                                className="h-8 px-4 text-xs font-medium bg-viper-purple hover:bg-viper-purple-dark text-white border-0 rounded-lg gap-1 cursor-pointer"
                                onClick={() => router.push('/dashboard/apps')}
                            >
                                Apps
                                <ChevronRight className="size-3.5" strokeWidth={2} />
                            </Button>
                        </div>
                        <div className="flex items-center justify-center flex-1 py-2">
                            <div className="relative size-20">
                                <Image
                                    src="/assets/viper-illustration.png"
                                    alt="Viper Network"
                                    width={80}
                                    height={80}
                                    className="object-contain opacity-80"
                                />
                            </div>
                        </div>

                        <div className="relative z-10">
                            <h4 className="text-[18px] font-medium text-white mb-2">Connect To Viper</h4>
                            <p className="text-[12px] text-white/50 leading-relaxed font-normal">
                                Get fast, reliable RPC relays across multiple blockchains with a single integration.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}