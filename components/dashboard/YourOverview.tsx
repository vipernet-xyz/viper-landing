'use client'

import { useQuery } from '@tanstack/react-query'

interface AnalyticsData {
    analytics: {
        total_requests_24h: number
    }
}

export function YourOverview() {
    const { data, isLoading } = useQuery<AnalyticsData>({
        queryKey: ['user-overview'],
        queryFn: async () => {
            const res = await fetch('/api/analytics', { credentials: 'include' })
            if (!res.ok) throw new Error('Failed to fetch analytics')
            return res.json()
        },
        refetchInterval: 30000,
    })

    const totalRelays = data?.analytics?.total_requests_24h || 0

    return (
        <div className="relative overflow-hidden rounded-[12px] min-h-[240px] bg-black p-6">
            <h3 className="text-white text-base font-medium mb-6">Your Overview</h3>

            <div className="relative overflow-hidden rounded-[10px] bg-gradient-to-br from-[rgba(147,112,219,0.15)] to-[rgba(75,0,130,0.1)] backdrop-blur-sm p-6 space-y-4">
                <div className="p-5 rounded-[10px] bg-[rgba(37,37,37,0.4)] backdrop-blur-sm">
                    {isLoading ? (
                        <div className="text-2xl font-normal text-white/50 mb-2 font-['Space_Grotesk']">Loading...</div>
                    ) : (
                        <div className="text-2xl font-normal text-white mb-2 font-['Space_Grotesk']">
                            {totalRelays.toLocaleString()}
                        </div>
                    )}
                    <div className="text-[11px] text-white/70 font-normal">Total Relays Sent (24h)</div>
                </div>

                <div className="p-5 rounded-[10px] bg-[rgba(37,37,37,0.4)] backdrop-blur-sm">
                    {isLoading ? (
                        <div className="text-2xl font-normal text-white/50 mb-2 font-['Space_Grotesk']">Loading...</div>
                    ) : (
                        <div className="text-2xl font-normal text-white mb-2 font-['Space_Grotesk']">
                            0
                        </div>
                    )}
                    <div className="text-[11px] text-white/70 font-normal">Total Nodes</div>
                </div>
            </div>
        </div>
    )
}