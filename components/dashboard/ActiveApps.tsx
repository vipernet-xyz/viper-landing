'use client'

import { ChevronRight, Link } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/components/auth/AuthProvider'

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
            <h4 className="text-white text-[13px] font-normal font-['Space_Grotesk'] mb-1">{name}</h4>
            <p className="text-white/70 text-[10px] font-normal mb-4">{requests}</p>

            <button
                onClick={() => router.push(`/dashboard/apps/${id}`)}
                className="flex items-center gap-1.5 h-[28px] px-3 rounded-[6px] border border-white/20 bg-transparent hover:bg-white/5 transition-colors cursor-pointer"
            >
                <Link className="size-3.5" strokeWidth={1.5} color="white" />
                <span className="text-white text-[10px] font-medium">Endpoint</span>
            </button>
        </div>
    )
}

export function ActiveApps() {
    const router = useRouter()
    const { user } = useAuth()

    const { data: apps, isLoading } = useQuery<App[]>({
        queryKey: ['active-apps'],
        queryFn: async () => {
            const res = await fetch('/api/apps', { credentials: 'include' })
            if (!res.ok) throw new Error('Failed to fetch apps')
            return res.json()
        },
        enabled: Boolean(user?.id),
        refetchInterval: 30000,
        retry: false,
    })

    const activeApps = apps?.filter(app => app.is_active).slice(0, 4) || []

    return (
        <div className="p-6 rounded-[12px] bg-[rgba(30,30,30,0.6)] border border-white/5 min-h-[220px]">
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-white text-base font-medium">Active Apps</h3>
                <button
                    onClick={() => router.push('/dashboard/apps')}
                    className="flex items-center gap-1 text-white/80 text-sm font-normal font-['Space_Grotesk'] hover:text-white transition-colors cursor-pointer px-3 py-1.5 rounded-lg hover:bg-white/5"
                >
                    See More
                    <ChevronRight className="size-4" strokeWidth={2} />
                </button>
            </div>

            {isLoading ? (
                <div className="text-white/50 text-sm text-center py-8">Loading apps...</div>
            ) : !user?.id ? (
                <div className="text-white/50 text-sm text-center py-8">Authentication required</div>
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
