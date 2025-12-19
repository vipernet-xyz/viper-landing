'use client'

import { ChevronRight, Link } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'

interface App {
    id: number
    name: string
    is_active: boolean
}

interface AppCardProps {
    id: number
    name: string
    requests: string
}

function AppCard({ id, name, requests }: AppCardProps) {
    const router = useRouter()

    return (
        <div className="p-4 rounded-[10px] bg-[rgba(81,81,81,0.15)] backdrop-blur-sm">
            <h4 className="text-white text-[12.16px] font-normal font-['Space_Grotesk'] mb-1">{name}</h4>
            <p className="text-white/70 text-[8.92px] font-normal mb-4">{requests}</p>

            <button
                onClick={() => router.push(`/dashboard/apps/${id}`)}
                className="flex items-center gap-1 h-[26px] px-3 rounded-[5px] border border-white/20 bg-transparent hover:bg-white/5 transition-colors"
            >
                <Link className="size-3" strokeWidth={1.5} color="white" />
                <span className="text-white text-[8px] font-medium">Endpoint</span>
            </button>
        </div>
    )
}

export function ActiveApps() {
    const router = useRouter()

    const { data: apps, isLoading } = useQuery<App[]>({
        queryKey: ['active-apps'],
        queryFn: async () => {
            const res = await fetch('/api/apps')
            if (!res.ok) throw new Error('Failed to fetch apps')
            return res.json()
        },
        refetchInterval: 30000,
    })

    const activeApps = apps?.filter(app => app.is_active).slice(0, 4) || []

    return (
        <div className="p-6 rounded-[10px] bg-[rgba(37,37,37,0.5)] backdrop-blur-sm">
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-white text-[11px] font-normal">Active Apps</h3>
                <button
                    onClick={() => router.push('/dashboard/apps')}
                    className="flex items-center gap-1 text-white text-[7.93px] font-normal font-['Space_Grotesk'] hover:opacity-80 transition-opacity"
                >
                    See More
                    <ChevronRight className="size-2.5" strokeWidth={2} />
                </button>
            </div>

            {isLoading ? (
                <div className="text-white/50 text-sm text-center py-8">Loading apps...</div>
            ) : activeApps.length === 0 ? (
                <div className="text-white/50 text-sm text-center py-8">No active apps yet</div>
            ) : (
                <div className="grid grid-cols-2 gap-4">
                    {activeApps.map((app) => (
                        <AppCard
                            key={app.id}
                            id={app.id}
                            name={app.name}
                            requests="Recent Activity"
                        />
                    ))}
                </div>
            )}
        </div>
    )
}