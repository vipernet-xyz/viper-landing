'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { ArrowLeft, Copy, Check, Link2, Settings, Trash2, Loader2, Plus, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Checkbox } from '@/components/ui/checkbox'
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog'
import { toast } from 'sonner'

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

interface Chain {
    id: number
    name: string
    description: string
    icon?: string
    status: string
    type: string
}

export default function AppDetailsPage() {
    const params = useParams()
    const router = useRouter()
    const queryClient = useQueryClient()
    const appId = params.id as string
    const [copied, setCopied] = useState(false)

    // Settings dialog state
    const [settingsOpen, setSettingsOpen] = useState(false)
    const [settingsActive, setSettingsActive] = useState(true)
    const [settingsRateLimit, setSettingsRateLimit] = useState('')
    const [settingsOrigins, setSettingsOrigins] = useState<string[]>([''])
    const [settingsChains, setSettingsChains] = useState<number[]>([])

    const { data: app, isLoading } = useQuery<AppData>({
        queryKey: ['app', appId],
        queryFn: async () => {
            const res = await fetch(`/api/apps/${appId}`, { credentials: 'include' })
            if (!res.ok) throw new Error('Failed to fetch app')
            return res.json()
        },
    })

    const { data: analytics } = useQuery({
        queryKey: ['app-analytics', appId],
        queryFn: async () => {
            const res = await fetch(`/api/analytics?app_id=${appId}`, { credentials: 'include' })
            if (!res.ok) throw new Error('Failed to fetch analytics')
            const data = await res.json()
            return data.analytics
        },
        enabled: !!appId,
    })

    const { data: chains = [] } = useQuery<Chain[]>({
        queryKey: ['chains'],
        queryFn: async () => {
            const res = await fetch('/api/chains', { credentials: 'include' })
            if (!res.ok) return []
            return res.json()
        },
    })

    // Populate settings form when app data loads or dialog opens
    useEffect(() => {
        if (app && settingsOpen) {
            setSettingsActive(app.is_active)
            setSettingsRateLimit(String(app.rate_limit))
            const origins = getAllowedOrigins()
            setSettingsOrigins(origins.length > 0 ? origins : [''])
            const chainIds = getAllowedChains().map((c: string) => {
                const num = parseInt(c, 10)
                return isNaN(num) ? 0 : num
            }).filter((n: number) => n > 0)
            setSettingsChains(chainIds)
        }
    }, [app, settingsOpen])

    const deleteMutation = useMutation({
        mutationFn: async () => {
            const res = await fetch(`/api/apps?appId=${appId}`, {
                method: 'DELETE',
                credentials: 'include',
            })
            if (!res.ok) {
                const err = await res.json()
                throw new Error(err.error || 'Failed to delete app')
            }
            return res.json()
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['apps'] })
            toast.success('App deleted successfully')
            router.push('/dashboard/apps')
        },
        onError: (error: Error) => {
            toast.error(error.message)
        },
    })

    const updateMutation = useMutation({
        mutationFn: async (updates: any) => {
            const res = await fetch('/api/apps', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify(updates),
            })
            if (!res.ok) {
                const err = await res.json()
                throw new Error(err.error || 'Failed to update app')
            }
            return res.json()
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['app', appId] })
            queryClient.invalidateQueries({ queryKey: ['apps'] })
            toast.success('App settings updated')
            setSettingsOpen(false)
        },
        onError: (error: Error) => {
            toast.error(error.message)
        },
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

    const getAllowedChains = () => {
        if (!app?.allowed_chains) return []
        if (Array.isArray(app.allowed_chains)) return app.allowed_chains
        if (typeof app.allowed_chains === 'string') {
            try { return JSON.parse(app.allowed_chains) } catch { return [] }
        }
        return []
    }

    const getAllowedOrigins = () => {
        if (!app?.allowed_origins) return []
        if (Array.isArray(app.allowed_origins)) return app.allowed_origins
        if (typeof app.allowed_origins === 'string') {
            try { return JSON.parse(app.allowed_origins) } catch { return [] }
        }
        return []
    }

    const handleSettingsSave = () => {
        const filteredOrigins = settingsOrigins.filter(o => o.trim() !== '')
        const formattedChains = settingsChains.map(id => String(id).padStart(4, '0'))

        updateMutation.mutate({
            appId: parseInt(appId),
            is_active: settingsActive,
            rate_limit: settingsRateLimit,
            allowed_origins: filteredOrigins,
            allowed_chains: formattedChains,
        })
    }

    const addOriginField = () => setSettingsOrigins([...settingsOrigins, ''])

    const removeOriginField = (index: number) => {
        const newOrigins = settingsOrigins.filter((_, i) => i !== index)
        setSettingsOrigins(newOrigins.length > 0 ? newOrigins : [''])
    }

    const updateOrigin = (index: number, value: string) => {
        const newOrigins = [...settingsOrigins]
        newOrigins[index] = value
        setSettingsOrigins(newOrigins)
    }

    const toggleChain = (chainId: number) => {
        setSettingsChains(prev =>
            prev.includes(chainId)
                ? prev.filter(id => id !== chainId)
                : [...prev, chainId]
        )
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
                    {/* Settings Dialog */}
                    <Dialog open={settingsOpen} onOpenChange={setSettingsOpen}>
                        <DialogTrigger asChild>
                            <Button
                                variant="outline"
                                className="h-8 px-3 bg-transparent hover:bg-white/5 border-white/20 text-white text-xs"
                            >
                                <Settings className="h-3 w-3 mr-1.5" />
                                Settings
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="bg-zinc-900 border-zinc-800 text-white max-w-lg max-h-[85vh] overflow-y-auto">
                            <DialogHeader>
                                <DialogTitle>App Settings</DialogTitle>
                                <DialogDescription className="text-zinc-400">
                                    Update configuration for {app.name}
                                </DialogDescription>
                            </DialogHeader>
                            <div className="space-y-5 py-4">
                                {/* Active Toggle */}
                                <div className="flex items-center justify-between">
                                    <Label htmlFor="is-active">Active</Label>
                                    <Switch
                                        id="is-active"
                                        checked={settingsActive}
                                        onCheckedChange={setSettingsActive}
                                    />
                                </div>

                                {/* Rate Limit */}
                                <div className="space-y-2">
                                    <Label htmlFor="rate-limit">Daily Rate Limit</Label>
                                    <Input
                                        id="rate-limit"
                                        type="number"
                                        value={settingsRateLimit}
                                        onChange={(e) => setSettingsRateLimit(e.target.value)}
                                        className="bg-zinc-950 border-zinc-800"
                                    />
                                </div>

                                {/* Allowed Origins */}
                                <div className="space-y-3">
                                    <Label>Allowed Origins</Label>
                                    <p className="text-sm text-zinc-400">
                                        Domains that can use this API key. Leave empty to allow all.
                                    </p>
                                    {settingsOrigins.map((origin, index) => (
                                        <div key={index} className="flex gap-2">
                                            <Input
                                                placeholder="https://example.com"
                                                value={origin}
                                                onChange={(e) => updateOrigin(index, e.target.value)}
                                                className="bg-zinc-950 border-zinc-800"
                                            />
                                            {settingsOrigins.length > 1 && (
                                                <Button
                                                    type="button"
                                                    variant="outline"
                                                    size="icon"
                                                    onClick={() => removeOriginField(index)}
                                                    className="bg-zinc-800 border-zinc-700 hover:bg-zinc-700 shrink-0"
                                                >
                                                    <X className="h-4 w-4" />
                                                </Button>
                                            )}
                                        </div>
                                    ))}
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={addOriginField}
                                        className="bg-zinc-800 border-zinc-700 hover:bg-zinc-700"
                                    >
                                        <Plus className="mr-2 h-4 w-4" />
                                        Add Origin
                                    </Button>
                                </div>

                                {/* Allowed Chains */}
                                <div className="space-y-3">
                                    <Label>Allowed Chains</Label>
                                    <p className="text-sm text-zinc-400">
                                        Select blockchain networks. Leave empty to allow all.
                                    </p>
                                    <div className="grid grid-cols-2 gap-3">
                                        {chains.map((chain) => (
                                            <div key={chain.id} className="flex items-center space-x-2">
                                                <Checkbox
                                                    id={`settings-chain-${chain.id}`}
                                                    checked={settingsChains.includes(chain.id)}
                                                    onCheckedChange={() => toggleChain(chain.id)}
                                                />
                                                <Label
                                                    htmlFor={`settings-chain-${chain.id}`}
                                                    className="text-sm font-normal cursor-pointer"
                                                >
                                                    {chain.name}
                                                </Label>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                            <DialogFooter>
                                <Button variant="ghost" onClick={() => setSettingsOpen(false)}>
                                    Cancel
                                </Button>
                                <Button
                                    onClick={handleSettingsSave}
                                    disabled={updateMutation.isPending}
                                    className="bg-indigo-600 hover:bg-indigo-700"
                                >
                                    {updateMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                    Save Changes
                                </Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>

                    {/* Delete Confirmation */}
                    <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <Button
                                variant="outline"
                                className="h-8 px-3 bg-transparent hover:bg-red-500/10 border-red-500/20 text-red-400 text-xs"
                            >
                                <Trash2 className="h-3 w-3 mr-1.5" />
                                Delete
                            </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent className="bg-zinc-900 border-zinc-800">
                            <AlertDialogHeader>
                                <AlertDialogTitle className="text-white">Delete App</AlertDialogTitle>
                                <AlertDialogDescription className="text-zinc-400">
                                    This will permanently delete <strong className="text-white">{app.name}</strong> and
                                    all associated relay logs and sessions. This action cannot be undone.
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel className="bg-zinc-800 border-zinc-700 text-white hover:bg-zinc-700">
                                    Cancel
                                </AlertDialogCancel>
                                <AlertDialogAction
                                    onClick={() => deleteMutation.mutate()}
                                    disabled={deleteMutation.isPending}
                                    className="bg-red-600 hover:bg-red-700 text-white"
                                >
                                    {deleteMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                    Delete App
                                </AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
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
