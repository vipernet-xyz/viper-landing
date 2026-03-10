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
        queryFn: async () => (await fetch('/api/apps', { credentials: 'include' })).json()
    })

    return (
        <div className="w-full space-y-6 min-h-full">
            {/* Stats Section */}
            <div className="w-full">
                <DashboardStats />
            </div>

            {/* Your Overview and Active Apps Section */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                <div className="lg:col-span-5">
                    <YourOverview />
                </div>
                <div className="lg:col-span-7">
                    <ActiveApps />
                </div>
            </div>
        </div>
    )
}