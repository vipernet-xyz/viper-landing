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
            const res = await fetch('/api/apps', { credentials: 'include' })
            if (!res.ok) throw new Error('Failed to fetch apps')
            return res.json()
        },
    })

    const { data: analyticsData } = useQuery({
        queryKey: ['app-analytics'],
        queryFn: async () => {
            if (apps.length === 0) return {}

            const analyticsPromises = apps.map(async (app) => {
                const res = await fetch(`/api/analytics?app_id=${app.id}`, { credentials: 'include' })
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
        <div className="space-y-7">
            {/* Page Title */}
            <h2 className="text-[28px] font-semibold text-white tracking-tight">My Apps</h2>

            {/* Search Bar and Add Button */}
            <div className="flex items-center justify-between gap-4">
                <div className="relative w-[340px]">
                    <Search className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40" />
                    <Input
                        placeholder="Search Apps"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="h-11 pl-5 pr-11 bg-transparent border-white/10 rounded-full text-sm text-white placeholder:text-white/40 focus-visible:ring-0 focus-visible:border-white/20"
                    />
                </div>
                <Button
                    onClick={() => router.push('/dashboard/apps/create')}
                    className="h-11 px-6 bg-white hover:bg-white/90 text-black text-sm font-medium rounded-full gap-2"
                >
                    <Plus className="h-4 w-4" strokeWidth={2} />
                    Add Application
                </Button>
            </div>

            {/* Apps Table */}
            <div className="rounded-[10px] border-[0.5px] border-white/10 overflow-hidden">
                <Table>
                    <TableHeader>
                        <TableRow className="border-b border-white/10 hover:bg-transparent">
                            <TableHead className="text-white/70 text-[13px] font-normal h-12 pl-6">App Name</TableHead>
                            <TableHead className="text-white/70 text-[13px] font-normal">Requests (24h)</TableHead>
                            <TableHead className="text-white/70 text-[13px] font-normal">Failed Requests (24h)</TableHead>
                            <TableHead className="text-white/70 text-[13px] font-normal">Created On</TableHead>
                            <TableHead className="text-white/70 text-[13px] font-normal">Networks</TableHead>
                            <TableHead className="text-white/70 text-[13px] font-normal">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {isLoading ? (
                            <TableRow>
                                <TableCell colSpan={6} className="text-center text-white/50 text-sm h-[66px]">
                                    Loading...
                                </TableCell>
                            </TableRow>
                        ) : filteredApps.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={6} className="text-center text-white/50 text-sm h-[66px]">
                                    {searchTerm ? 'No apps found' : 'No apps created yet'}
                                </TableCell>
                            </TableRow>
                        ) : (
                            filteredApps.map((app) => {
                                const appAnalytics = analyticsData?.[app.id]
                                return (
                                    <TableRow
                                        key={app.id}
                                        className="border-b border-white/[0.06] hover:bg-white/[0.03] cursor-pointer h-[66px]"
                                        onClick={() => router.push(`/dashboard/apps/${app.id}`)}
                                    >
                                        <TableCell className="pl-6 text-white text-sm font-normal">{app.name}</TableCell>
                                        <TableCell className="text-white text-sm font-normal">
                                            {appAnalytics?.total_requests_24h ?? '-'}
                                        </TableCell>
                                        <TableCell className="text-white text-sm font-normal">
                                            {appAnalytics?.failed_requests_24h ?? '-'}
                                        </TableCell>
                                        <TableCell className="text-white text-sm font-normal">
                                            {formatDate(app.created_at)}
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-1">
                                                {app.allowed_chains.length > 0 ? (
                                                    <>
                                                        {app.allowed_chains.slice(0, 2).map((chainId, idx) => (
                                                            <div
                                                                key={idx}
                                                                className="h-[26px] w-[26px] bg-gradient-to-br from-[#7f5ee3] to-[#5a3db8] text-white text-[9px] font-medium rounded-full flex items-center justify-center"
                                                                style={{ marginLeft: idx > 0 ? '-4px' : '0' }}
                                                            >
                                                                {chainId.replace(/^0+/, '') || '0'}
                                                            </div>
                                                        ))}
                                                        {app.allowed_chains.length > 2 && (
                                                            <span className="text-white text-[13px] font-bold ml-1.5">
                                                                +{app.allowed_chains.length - 2}
                                                            </span>
                                                        )}
                                                    </>
                                                ) : (
                                                    <span className="text-white/50 text-xs">All</span>
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
                                                className="h-9 px-4 bg-transparent hover:bg-white/5 border border-white/20 rounded-full gap-2 text-white text-[13px] font-medium"
                                            >
                                                <Link2 className="h-3.5 w-3.5" strokeWidth={2} />
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
