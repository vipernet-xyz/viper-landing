'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useQuery } from '@tanstack/react-query'
import { Search, Plus, Link2 } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'

interface AppData {
    id: number
    name: string
    description: string | null
    api_key: string
    created_at: string
    allowed_chains: string[]
    allowed_origins: string[]
    rate_limit: number
    is_active: boolean
}

interface AppAnalytics {
    [appId: number]: {
        total_requests_24h: number
        failed_requests_24h: number
    }
}

export default function AppsPage() {
    const router = useRouter()
    const [searchTerm, setSearchTerm] = useState('')

    const { data: apps = [], isLoading } = useQuery<AppData[]>({
        queryKey: ['apps'],
        queryFn: async () => {
            const res = await fetch('/api/apps')
            if (!res.ok) throw new Error('Failed to fetch apps')
            return res.json()
        },
    })

    // Fetch analytics for each app
    const { data: analyticsData } = useQuery({
        queryKey: ['app-analytics'],
        queryFn: async () => {
            if (apps.length === 0) return {}

            const analyticsPromises = apps.map(async (app) => {
                const res = await fetch(`/api/analytics?app_id=${app.id}`)
                if (!res.ok) return null
                const data = await res.json()
                return {
                    appId: app.id,
                    analytics: data.analytics
                }
            })

            const results = await Promise.all(analyticsPromises)
            const analyticsMap: AppAnalytics = {}

            results.forEach(result => {
                if (result) {
                    analyticsMap[result.appId] = {
                        total_requests_24h: result.analytics.total_requests_24h,
                        failed_requests_24h: result.analytics.failed_requests_24h
                    }
                }
            })

            return analyticsMap
        },
        enabled: apps.length > 0,
    })

    const formatDate = (date: string): string => {
        const d = new Date(date)
        return `${d.getMonth() + 1}/${d.getDate()}/${d.getFullYear().toString().slice(-2)}`
    }

    const filteredApps = (Array.isArray(apps) ? apps : []).filter(app =>
        app.name.toLowerCase().includes(searchTerm.toLowerCase())
    )

    return (
        <div className="space-y-6">
            {/* Page Title */}
            <h2 className="text-xl font-medium text-white">My Apps</h2>

            {/* Search Bar and Add Button */}
            <div className="flex items-center justify-between gap-4">
                <div className="relative w-[300px]">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-[11px] w-[11px] text-white/55" />
                    <Input
                        placeholder="Search Apps"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="h-8 pl-9 pr-3 bg-viper-bg-card border-white/10 rounded-[7px] text-[10px] font-medium text-white/60 placeholder:text-white/60"
                    />
                </div>
                <Button
                    onClick={() => router.push('/dashboard/apps/create')}
                    className="h-8 px-4 bg-white hover:bg-white/90 text-black text-[10px] font-medium rounded-[5px] border-[0.575px] border-white/20 gap-1"
                >
                    <Plus className="h-2 w-2" />
                    Add Application
                </Button>
            </div>

            {/* Apps Table */}
            <div className="rounded-[10px] border-[0.5px] border-white/10 bg-[rgba(22,22,22,0.85)] overflow-hidden">
                <Table>
                    <TableHeader>
                        <TableRow className="bg-[#1e1e1e] border-b-0 hover:bg-[#1e1e1e]">
                            <TableHead className="text-white text-[10px] font-normal h-[41px]">App Name</TableHead>
                            <TableHead className="text-white text-[10px] font-normal">Requests (24h)</TableHead>
                            <TableHead className="text-white text-[10px] font-normal">Failed Requests (24h)</TableHead>
                            <TableHead className="text-white text-[10px] font-normal">Created On</TableHead>
                            <TableHead className="text-white text-[10px] font-normal">Networks</TableHead>
                            <TableHead className="text-white text-[10px] font-normal">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {isLoading ? (
                            <TableRow>
                                <TableCell colSpan={6} className="text-center text-white/50 text-[10px] h-20">
                                    Loading...
                                </TableCell>
                            </TableRow>
                        ) : filteredApps.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={6} className="text-center text-white/50 text-[10px] h-20">
                                    {searchTerm ? 'No apps found' : 'No apps created yet'}
                                </TableCell>
                            </TableRow>
                        ) : (
                            filteredApps.map((app) => {
                                const appAnalytics = analyticsData?.[app.id]
                                return (
                                    <TableRow
                                        key={app.id}
                                        className="border-b-[0.5px] border-white/10 hover:bg-white/5 cursor-pointer"
                                        onClick={() => router.push(`/dashboard/apps/${app.id}`)}
                                    >
                                        <TableCell className="text-white text-[10px] font-normal">{app.name}</TableCell>
                                        <TableCell className="text-white text-[10px] font-normal">
                                            {appAnalytics?.total_requests_24h ?? '-'}
                                        </TableCell>
                                        <TableCell className="text-white text-[10px] font-normal">
                                            {appAnalytics?.failed_requests_24h ?? '-'}
                                        </TableCell>
                                        <TableCell className="text-white text-[10px] font-normal">
                                            {formatDate(app.created_at)}
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-1">
                                                {app.allowed_chains.length > 0 ? (
                                                    <>
                                                        {app.allowed_chains.slice(0, 2).map((chainId, idx) => (
                                                            <Badge
                                                                key={idx}
                                                                className="h-[10px] min-w-[6px] px-1 bg-gradient-to-r from-[#7f5ee3] to-[#46337d] text-white text-[8px] font-normal rounded-full flex items-center justify-center"
                                                            >
                                                                {chainId}
                                                            </Badge>
                                                        ))}
                                                        {app.allowed_chains.length > 2 && (
                                                            <span className="text-white text-[8px] font-[681] lowercase">
                                                                +{app.allowed_chains.length - 2}
                                                            </span>
                                                        )}
                                                    </>
                                                ) : (
                                                    <span className="text-white/50 text-[8px]">All</span>
                                                )}
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <Button
                                                variant="outline"
                                                onClick={(e) => {
                                                    e.stopPropagation()
                                                    router.push(`/dashboard/apps/${app.id}`)
                                                }}
                                                className="h-[26px] px-3 bg-transparent hover:bg-white/5 border-[0.5px] border-white/20 rounded-[5px] gap-[3.55px] text-white text-[8px] font-medium"
                                            >
                                                <Link2 className="h-[11px] w-[11px]" strokeWidth={0.7} />
                                                Endpoint
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                )
                            })
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    )
}