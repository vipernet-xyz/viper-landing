'use client'

import { useQuery } from '@tanstack/react-query'
import { DashboardStats } from '@/components/dashboard/DashboardStats'
import { YourOverview } from '@/components/dashboard/YourOverview'
import { ActiveApps } from '@/components/dashboard/ActiveApps'
import { useAuth } from '@/components/auth/AuthProvider'

export default function DashboardPage() {
    const { user } = useAuth()
    const { data: apps } = useQuery({
        queryKey: ['apps'],
        queryFn: async () => (await fetch('/api/apps')).json()
    })

    return (
        <div className="space-y-6">
            <h2 className="text-xl font-medium text-white mb-6">Dashboard</h2>

            {/* Stats Section */}
            <DashboardStats />

            {/* Your Overview and Active Apps Section */}
            <div className="grid grid-cols-12 gap-6">
                <div className="col-span-5">
                    <YourOverview />
                </div>
                <div className="col-span-7">
                    <ActiveApps />
                </div>
            </div>
        </div>
    )
}