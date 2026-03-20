'use client'

import { useQuery } from '@tanstack/react-query'
import { useAuth } from '@/components/auth/AuthProvider'

interface AnalyticsData {
    analytics: {
        total_requests_24h: number
    }
}

export function YourOverview() {
    const { user } = useAuth()
    const { data, isLoading } = useQuery<AnalyticsData>({
        queryKey: ['user-overview'],
        queryFn: async () => {
            const res = await fetch('/api/analytics', { credentials: 'include' })
            if (!res.ok) throw new Error('Failed to fetch analytics')
            return res.json()
        },
        enabled: Boolean(user?.id),
        refetchInterval: 30000,
        retry: false,
    })

    const totalRelays = data?.analytics?.total_requests_24h || 0

    return (
        <div className="relative overflow-hidden rounded-[12px] min-h-[200px] bg-[rgba(37,37,37,0.5)] p-6">
            <h3 className="text-white text-base font-medium mb-6">Your Overview</h3>

            <div className="relative overflow-hidden rounded-[10px] bg-gradient-to-br from-[rgba(127,94,227,0.12)] to-[rgba(75,0,130,0.08)] p-5">
                <div className="p-4 rounded-[10px] bg-[rgba(37,37,37,0.5)] backdrop-blur-sm">
                    {isLoading ? (
                        <div className="text-2xl font-normal text-white/50 mb-2 font-['Space_Grotesk']">...</div>
                    ) : !user?.id ? (
                        <div className="text-sm font-normal text-white/50 mb-2">Authentication required</div>
                    ) : (
                        <div className="text-2xl font-normal text-white mb-2 font-['Space_Grotesk']">
                            {totalRelays.toLocaleString()}
                        </div>
                    )}
                    <div className="text-[11px] text-white/60 font-normal">Total Relays Sent (24h)</div>
                </div>
            </div>
        </div>
    )
}
