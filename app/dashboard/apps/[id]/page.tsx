'use client'

import { useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useQuery } from '@tanstack/react-query'
import { ArrowLeft, Copy, Check, Link2, Settings, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface AppData {
    id: number
    name: string
    description: string | null
    api_key: string
    created_at: string
    allowed_chains: string[] | any
    allowed_origins: string[] | any
    rate_limit: number
    is_active: boolean
}

export default function AppDetailsPage() {
    const params = useParams()
    const router = useRouter()
    const appId = params.id as string
    const [copied, setCopied] = useState(false)

    const { data: app, isLoading } = useQuery<AppData>({
        queryKey: ['app', appId],
        queryFn: async () => {
            const res = await fetch('/api/apps')
            if (!res.ok) throw new Error('Failed to fetch apps')
            const apps = await res.json()
            const foundApp = apps.find((a: AppData) => a.id === parseInt(appId))
            if (!foundApp) throw new Error('App not found')
            return foundApp
        },
    })

    const { data: analytics } = useQuery({
        queryKey: ['app-analytics', appId],
        queryFn: async () => {
            const res = await fetch(`/api/analytics?app_id=${appId}`)
            if (!res.ok) throw new Error('Failed to fetch analytics')
            const data = await res.json()
            return data.analytics
        },
        enabled: !!appId,
    })

    const handleCopyApiKey = async () => {
        if (app?.api_key) {
            await navigator.clipboard.writeText(app.api_key)
            setCopied(true)
            setTimeout(() => setCopied(false), 2000)
        }
    }

    const formatDate = (date: string): string => {
        const d = new Date(date)
        return d.toLocaleDateString('en-US', {
            month: 'long',
            day: 'numeric',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        })
    }

    // Parse allowed_chains and allowed_origins if they're JSON strings
    const getAllowedChains = () => {
        if (!app?.allowed_chains) return []
        if (Array.isArray(app.allowed_chains)) return app.allowed_chains
        if (typeof app.allowed_chains === 'string') {
            try {
                return JSON.parse(app.allowed_chains)
            } catch {
                return []
            }
        }
        return []
    }

    const getAllowedOrigins = () => {
        if (!app?.allowed_origins) return []
        if (Array.isArray(app.allowed_origins)) return app.allowed_origins
        if (typeof app.allowed_origins === 'string') {
            try {
                return JSON.parse(app.allowed_origins)
            } catch {
                return []
            }
        }
        return []
    }

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-64">
                <p className="text-white/50 text-sm">Loading...</p>
            </div>
        )
    }

    if (!app) {
        return (
            <div className="flex items-center justify-center h-64">
                <p className="text-white/50 text-sm">App not found</p>
            </div>
        )
    }

    const allowedChains = getAllowedChains()
    const allowedOrigins = getAllowedOrigins()

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Button
                        variant="ghost"
                        onClick={() => router.push('/dashboard/apps')}
                        className="h-8 w-8 p-0 hover:bg-white/5"
                    >
                        <ArrowLeft className="h-4 w-4 text-white" />
                    </Button>
                    <div>
                        <h2 className="text-xl font-medium text-white">{app.name}</h2>
                        {app.description && (
                            <p className="text-xs text-white/50 mt-1">{app.description}</p>
                        )}
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <Button
                        variant="outline"
                        className="h-8 px-3 bg-transparent hover:bg-white/5 border-white/20 text-white text-xs"
                    >
                        <Settings className="h-3 w-3 mr-1.5" />
                        Settings
                    </Button>
                    <Button
                        variant="outline"
                        className="h-8 px-3 bg-transparent hover:bg-red-500/10 border-red-500/20 text-red-400 text-xs"
                    >
                        <Trash2 className="h-3 w-3 mr-1.5" />
                        Delete
                    </Button>
                </div>
            </div>

            {/* API Key Card */}
            <Card className="border-white/10 bg-[rgba(22,22,22,0.85)]">
                <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium text-white">API Key</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                    <div className="flex items-center gap-2 p-3 bg-black/40 rounded-lg border border-white/5">
                        <code className="flex-1 text-xs text-white/70 font-mono break-all">
                            {app.api_key}
                        </code>
                        <Button
                            onClick={handleCopyApiKey}
                            variant="ghost"
                            className="h-8 w-8 p-0 hover:bg-white/5 shrink-0"
                        >
                            {copied ? (
                                <Check className="h-4 w-4 text-green-400" />
                            ) : (
                                <Copy className="h-4 w-4 text-white/50" />
                            )}
                        </Button>
                    </div>
                    <p className="text-[10px] text-white/40">
                        Include this API key in your requests using the <code className="px-1 py-0.5 bg-white/5 rounded text-white/60">x-api-key</code> header.
                    </p>
                </CardContent>
            </Card>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="border-white/10 bg-[rgba(22,22,22,0.85)]">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-xs font-normal text-white/50">Requests (24h)</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-2xl font-semibold text-white">
                            {analytics?.total_requests_24h?.toLocaleString() ?? '-'}
                        </p>
                    </CardContent>
                </Card>

                <Card className="border-white/10 bg-[rgba(22,22,22,0.85)]">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-xs font-normal text-white/50">Failed Requests (24h)</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-2xl font-semibold text-white">
                            {analytics?.failed_requests_24h?.toLocaleString() ?? '-'}
                        </p>
                    </CardContent>
                </Card>

                <Card className="border-white/10 bg-[rgba(22,22,22,0.85)]">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-xs font-normal text-white/50">Avg Response Time</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-2xl font-semibold text-white">
                            {analytics?.avg_response_time ? `${analytics.avg_response_time}ms` : '-'}
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Configuration Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Networks Card */}
                <Card className="border-white/10 bg-[rgba(22,22,22,0.85)]">
                    <CardHeader className="pb-3">
                        <CardTitle className="text-sm font-medium text-white">Allowed Networks</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {allowedChains.length > 0 ? (
                            <div className="flex flex-wrap gap-2">
                                {allowedChains.map((chainId: string, idx: number) => (
                                    <Badge
                                        key={idx}
                                        className="h-6 px-3 bg-gradient-to-r from-[#7f5ee3] to-[#46337d] text-white text-xs font-normal rounded-full"
                                    >
                                        {chainId}
                                    </Badge>
                                ))}
                            </div>
                        ) : (
                            <p className="text-xs text-white/50">All networks allowed</p>
                        )}
                    </CardContent>
                </Card>

                {/* Rate Limit Card */}
                <Card className="border-white/10 bg-[rgba(22,22,22,0.85)]">
                    <CardHeader className="pb-3">
                        <CardTitle className="text-sm font-medium text-white">Rate Limit</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-xl font-semibold text-white">
                            {app.rate_limit.toLocaleString()}
                        </p>
                        <p className="text-xs text-white/40 mt-1">requests per day</p>
                    </CardContent>
                </Card>

                {/* Allowed Origins Card */}
                <Card className="border-white/10 bg-[rgba(22,22,22,0.85)] md:col-span-2">
                    <CardHeader className="pb-3">
                        <CardTitle className="text-sm font-medium text-white">Allowed Origins</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {allowedOrigins.length > 0 ? (
                            <div className="space-y-2">
                                {allowedOrigins.map((origin: string, idx: number) => (
                                    <div
                                        key={idx}
                                        className="flex items-center gap-2 p-2 bg-black/40 rounded border border-white/5"
                                    >
                                        <Link2 className="h-3 w-3 text-white/30 shrink-0" />
                                        <code className="text-xs text-white/70 font-mono">{origin}</code>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-xs text-white/50">All origins allowed</p>
                        )}
                    </CardContent>
                </Card>
            </div>

            {/* Metadata */}
            <Card className="border-white/10 bg-[rgba(22,22,22,0.85)]">
                <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium text-white">Metadata</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                    <div className="flex items-center justify-between py-2 border-b border-white/5">
                        <span className="text-xs text-white/50">App ID</span>
                        <span className="text-xs text-white font-mono">{app.id}</span>
                    </div>
                    <div className="flex items-center justify-between py-2 border-b border-white/5">
                        <span className="text-xs text-white/50">Created At</span>
                        <span className="text-xs text-white">{formatDate(app.created_at)}</span>
                    </div>
                    <div className="flex items-center justify-between py-2">
                        <span className="text-xs text-white/50">Status</span>
                        <Badge className={`h-5 px-2 text-[10px] ${app.is_active ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                            {app.is_active ? 'Active' : 'Inactive'}
                        </Badge>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
