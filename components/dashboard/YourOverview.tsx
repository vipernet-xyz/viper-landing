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
            const res = await fetch('/api/analytics')
            if (!res.ok) throw new Error('Failed to fetch analytics')
            return res.json()
        },
        refetchInterval: 30000,
    })

    const totalRelays = data?.analytics?.total_requests_24h || 0

    return (
        <div
            className="relative overflow-hidden rounded-[10px] min-h-[199px] bg-black"
            style={{
                backgroundImage: 'url(/assets/backgrounds/overview-bg.svg)',
                backgroundSize: 'cover',
                backgroundPosition: 'center'
            }}
        >
            <div className="relative p-6">
                <h3 className="text-white text-[15px] font-normal mb-6">Your Overview</h3>

                <div className="p-6 rounded-[10px] bg-[rgba(37,37,37,0.5)] backdrop-blur-sm">
                    {isLoading ? (
                        <div className="text-xl font-normal text-white/50 mb-2 font-['Space_Grotesk']">Loading...</div>
                    ) : (
                        <div className="text-xl font-normal text-white mb-2 font-['Space_Grotesk']">
                            {totalRelays.toLocaleString()}
                        </div>
                    )}
                    <div className="text-[11px] text-white/70 font-normal">Total Relays Sent (24h)</div>
                </div>
            </div>
        </div>
    )
}