'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Pencil, Copy, ChevronDown, FileText, TrendingUp } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Area, AreaChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer } from 'recharts'
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import { MOCK_APPS } from '@/lib/mock-apps'
import { toast } from 'sonner'

interface AppDetailPageProps {
    params: {
        id: string
    }
}

export default function AppDetailPage({ params }: AppDetailPageProps) {
    const router = useRouter()
    const [chain, setChain] = useState<string>('ethereum')
    const [network, setNetwork] = useState<string>('mainnet')
    const [requestType, setRequestType] = useState<string>('http')

    // Find app from mock data
    const app = MOCK_APPS.find(a => a.id === parseInt(params.id))

    if (!app) {
        return (
            <div className="flex h-64 items-center justify-center">
                <p className="text-white/50">App not found</p>
            </div>
        )
    }

    // Generate dynamic network URL based on selections
    const getNetworkPrefix = () => {
        if (chain === 'ethereum') {
            return network === 'mainnet' ? 'eth-mainnet' : 'eth-goerli'
        } else if (chain === 'polygon') {
            return network === 'mainnet' ? 'polygon-mainnet' : 'polygon-mumbai'
        } else if (chain === 'binance') {
            return network === 'mainnet' ? 'bsc-mainnet' : 'bsc-testnet'
        }
        return 'eth-mainnet'
    }

    const networkUrl = `https://${getNetworkPrefix()}.vipernet.xyz/v2/${app.api_key}`
    
    // Generate dynamic curl example based on selections
    const getMethodExample = () => {
        if (chain === 'ethereum') {
            return {
                method: 'eth_getBlockByNumber',
                params: '["latest", false]'
            }
        } else if (chain === 'polygon') {
            return {
                method: 'eth_blockNumber',
                params: '[]'
            }
        } else if (chain === 'binance') {
            return {
                method: 'eth_getBalance',
                params: '["0x...", "latest"]'
            }
        }
        return {
            method: 'eth_getBlockByNumber',
            params: '["latest", false]'
        }
    }

    const methodExample = getMethodExample()
    const curlExample = `curl -X POST ${networkUrl} \\
-H "Content-Type: application/json" \\
-d '{
  "jsonrpc": "2.0",
  "method": "${methodExample.method}",
  "params": ${methodExample.params},
  "id": 1
}'`

    const copyToClipboard = (text: string, label: string) => {
        navigator.clipboard.writeText(text)
        toast.success(`${label} copied to clipboard`)
    }

    return (
        <div className="space-y-6">
            {/* Header with Back Button */}
            <div className="flex items-start justify-between">
                <div className="flex items-start gap-4">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => router.back()}
                        className="h-8 w-8 text-white hover:bg-white/10"
                    >
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                    <div>
                        <div className="flex items-center gap-2">
                            <h2 className="text-xl font-medium text-white">{app.name}</h2>
                            <button className="text-white/70 hover:text-white">
                                <Pencil className="h-2 w-2" />
                            </button>
                        </div>
                        <p className="text-[11px] text-viper-text-muted-70 mt-1">
                            {app.description || 'Example application with demo data'}
                        </p>
                    </div>
                </div>

                {/* API Key Display */}
                <div className="flex items-center gap-2">
                    <span className="text-[10px] font-medium text-viper-text-muted-60">API Key</span>
                    <div className="flex items-center h-8 px-3 bg-[rgba(37,37,37,0.3)] border-[0.5px] border-white/10 rounded-r-[5px]">
                        <span className="text-[10px] font-normal text-white/80">{app.api_key}</span>
                        <button
                            onClick={() => copyToClipboard(app.api_key, 'API Key')}
                            className="ml-3 text-white/70 hover:text-white"
                        >
                            <Copy className="h-[11px] w-[11px]" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Tabs */}
            <Tabs defaultValue="endpoints" className="w-full">
                <TabsList className="bg-[#1e1e1e] border-[0.5px] border-white/10 rounded-[7px] h-[34px] p-0">
                    <TabsTrigger
                        value="endpoints"
                        className="text-[11px] font-normal text-white data-[state=active]:bg-transparent data-[state=inactive]:text-viper-text-muted-60 h-full px-4"
                    >
                        Endpoints
                    </TabsTrigger>
                    <TabsTrigger
                        value="analytics"
                        className="text-[11px] font-normal text-white data-[state=active]:bg-transparent data-[state=inactive]:text-viper-text-muted-60 h-full px-4"
                    >
                        Analytics
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="endpoints" className="mt-6">
                    <div className="grid grid-cols-12 gap-6">
                        {/* Left Panel - Connect Your App */}
                        <div className="col-span-5">
                            <div className="rounded-[10px] border-[0.6px] border-white/10 bg-[rgba(22,22,22,0.85)]">
                                <div className="bg-[rgba(38,38,38,0.25)] p-7 space-y-6">
                                    <h3 className="text-[17px] font-medium text-white">Connect Your App</h3>

                                    {/* Chain Select */}
                                    <div className="space-y-2.5">
                                        <label className="text-[13px] font-normal text-white">Chain</label>
                                        <Select value={chain} onValueChange={setChain}>
                                            <SelectTrigger className="h-8 bg-[#252525] border-[0.5px] border-white/10 rounded-[5px] text-[10px] font-medium text-viper-text-muted-60 hover:bg-[#2a2a2a]">
                                                <SelectValue placeholder="Select Chain" />
                                            </SelectTrigger>
                                            <SelectContent className="bg-[#252525] border-white/10">
                                                <SelectItem value="ethereum" className="text-white text-[10px]">Ethereum</SelectItem>
                                                <SelectItem value="polygon" className="text-white text-[10px]">Polygon</SelectItem>
                                                <SelectItem value="binance" className="text-white text-[10px]">Binance Smart Chain</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    {/* Network Select */}
                                    <div className="space-y-2.5">
                                        <label className="text-[13px] font-normal text-white">Network</label>
                                        <Select value={network} onValueChange={setNetwork}>
                                            <SelectTrigger className="h-8 bg-[#252525] border-[0.5px] border-white/10 rounded-[5px] text-[10px] font-medium text-viper-text-muted-60 hover:bg-[#2a2a2a]">
                                                <SelectValue placeholder="Select Network" />
                                            </SelectTrigger>
                                            <SelectContent className="bg-[#252525] border-white/10">
                                                <SelectItem value="mainnet" className="text-white text-[10px]">Mainnet</SelectItem>
                                                <SelectItem value="testnet" className="text-white text-[10px]">Testnet</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    {/* Request Type Select */}
                                    <div className="space-y-2.5">
                                        <label className="text-[13px] font-normal text-white">Request Type</label>
                                        <Select value={requestType} onValueChange={setRequestType}>
                                            <SelectTrigger className="h-8 bg-[#252525] border-[0.5px] border-white/10 rounded-[5px] text-[10px] font-medium text-viper-text-muted-60 hover:bg-[#2a2a2a]">
                                                <SelectValue placeholder="Select Request Type" />
                                            </SelectTrigger>
                                            <SelectContent className="bg-[#252525] border-white/10">
                                                <SelectItem value="http" className="text-white text-[10px]">HTTP</SelectItem>
                                                <SelectItem value="websocket" className="text-white text-[10px]">WebSocket</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    {/* Docs Button */}
                                    <Button
                                        variant="outline"
                                        className="h-8 px-4 bg-[#252525] hover:bg-[#2a2a2a] border-[0.5px] border-white/20 rounded-[5px] gap-[3px] text-white text-[10px] font-medium"
                                    >
                                        <FileText className="h-[13px] w-[13px]" />
                                        Docs
                                    </Button>
                                </div>
                            </div>
                        </div>

                        {/* Right Panel - Network URL and Example */}
                        <div className="col-span-7 space-y-5">
                            {/* Network URL */}
                            <div className="space-y-3">
                                <h3 className="text-[13px] font-normal text-white">Network URL</h3>
                                <div className="flex items-center gap-2">
                                    <span className="text-[10px] font-medium text-viper-text-muted-60">URL</span>
                                    <div className="flex-1 flex items-center h-8 px-4 bg-[rgba(37,37,37,0.3)] border-[0.5px] border-white/10 rounded-r-[5px]">
                                        <span className="text-[10px] font-normal text-white/80 flex-1 truncate">
                                            {networkUrl}
                                        </span>
                                        <button
                                            onClick={() => copyToClipboard(networkUrl, 'URL')}
                                            className="ml-3 text-white/70 hover:text-white flex-shrink-0"
                                        >
                                            <Copy className="h-[11px] w-[11px]" />
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Example Request */}
                            <div className="space-y-3">
                                <h3 className="text-[13px] font-normal text-white">Example Request</h3>
                                <div className="bg-viper-bg-sidebar rounded-[10px] overflow-hidden">
                                    {/* Terminal Dots */}
                                    <div className="flex items-center gap-1.5 px-4 py-2.5 border-b border-white/10">
                                        <div className="h-2 w-2 rounded-full bg-[#ff5f56]" />
                                        <div className="h-2 w-2 rounded-full bg-[#ffbd2e]" />
                                        <div className="h-2 w-2 rounded-full bg-[#27c93f]" />
                                        <button
                                            onClick={() => copyToClipboard(curlExample, 'Code')}
                                            className="ml-auto text-white/70 hover:text-white"
                                        >
                                            <Copy className="h-[10px] w-[10px]" />
                                        </button>
                                    </div>
                                    {/* Code Block */}
                                    <pre className="p-5 overflow-x-auto scrollbar-hidden">
                                        <code className="text-[10px] font-normal text-white font-['Source_Code_Pro'] leading-[1.6]">
                                            {curlExample}
                                        </code>
                                    </pre>
                                </div>
                            </div>
                        </div>
                    </div>
                </TabsContent>

                <TabsContent value="analytics" className="mt-6 space-y-6">
                    {/* Metrics Cards */}
                    <div className="grid grid-cols-4 gap-4">
                        {/* Total Requests */}
                        <div className="rounded-[10px] border-[0.5px] border-white/10 bg-[#1e1e1e] p-6 shadow-[inset_0px_-60px_60px_rgba(127,94,227,0.2)]">
                            <div className="space-y-4">
                                <div className="text-[30px] font-normal text-white font-['Space_Grotesk']">
                                    70.7k
                                </div>
                                <div className="text-[11px] font-normal text-white">
                                    Total Requests (24 Hours)
                                </div>
                            </div>
                        </div>

                        {/* Success Rate */}
                        <div className="rounded-[10px] border-[0.5px] border-white/10 bg-[#1e1e1e] p-6 shadow-[inset_0px_-60px_60px_rgba(127,94,227,0.2)]">
                            <div className="space-y-4">
                                <div className="text-[30px] font-normal text-white font-['Space_Grotesk']">
                                    99.99%
                                </div>
                                <div className="flex items-center justify-between">
                                    <div className="text-[11px] font-normal text-white">
                                        Success Rate (24 Hours)
                                    </div>
                                    <div className="flex items-center gap-1 h-[18px] px-2 bg-[#1e1e1e] border-[0.527px] border-white/20 rounded-[4px]">
                                        <TrendingUp className="h-2 w-2 text-white" />
                                        <span className="text-[6px] font-normal text-white">+ 12.7%</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Average Response Time */}
                        <div className="rounded-[10px] border-[0.5px] border-white/10 bg-[#1e1e1e] p-6 shadow-[inset_0px_-60px_60px_rgba(127,94,227,0.2)]">
                            <div className="space-y-4">
                                <div className="text-[30px] font-normal text-white font-['Space_Grotesk']">
                                    250 ms
                                </div>
                                <div className="text-[11px] font-normal text-white">
                                    Average Response Time (24 Hours)
                                </div>
                            </div>
                        </div>

                        {/* Invalid Requests */}
                        <div className="rounded-[10px] border-[0.5px] border-white/10 bg-[#1e1e1e] p-6 shadow-[inset_0px_-60px_60px_rgba(127,94,227,0.2)]">
                            <div className="space-y-4">
                                <div className="text-[30px] font-normal text-white font-['Space_Grotesk']">
                                    2
                                </div>
                                <div className="text-[11px] font-normal text-white">
                                    Invalid Rquests (24 Hours)
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Charts */}
                    <div className="grid grid-cols-2 gap-6">
                        {/* Total Number of Relays Chart */}
                        <div className="rounded-[10px] border-[0.5px] border-white/10 bg-[rgba(30,30,30,0.75)] p-6">
                            <h3 className="text-[15px] font-normal text-white mb-6">Total Number of Relays</h3>
                            <ChartContainer
                                config={{
                                    relays: {
                                        label: "Relays",
                                        color: "#b6a3ff",
                                    },
                                }}
                                className="h-[220px] w-full"
                            >
                                <AreaChart
                                    data={[
                                        { time: "00", value: 20 },
                                        { time: "04", value: 35 },
                                        { time: "08", value: 45 },
                                        { time: "12", value: 60 },
                                        { time: "16", value: 70 },
                                        { time: "20", value: 85 },
                                        { time: "24", value: 95 },
                                    ]}
                                >
                                    <defs>
                                        <linearGradient id="relayGradient" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="0%" stopColor="#b6a3ff" stopOpacity={0.8} />
                                            <stop offset="100%" stopColor="#46337d" stopOpacity={0.2} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="0" stroke="rgba(255,255,255,0.1)" vertical={false} />
                                    <XAxis
                                        dataKey="time"
                                        stroke="#6d7280"
                                        fontSize={10}
                                        tickLine={false}
                                        axisLine={false}
                                    />
                                    <YAxis
                                        stroke="#6d7280"
                                        fontSize={10}
                                        tickLine={false}
                                        axisLine={false}
                                        tickFormatter={(value) => `${value}`}
                                    />
                                    <ChartTooltip content={<ChartTooltipContent />} />
                                    <Area
                                        type="monotone"
                                        dataKey="value"
                                        stroke="#b6a3ff"
                                        strokeWidth={2}
                                        fill="url(#relayGradient)"
                                    />
                                </AreaChart>
                            </ChartContainer>
                        </div>

                        {/* Request Health Chart */}
                        <div className="rounded-[10px] border-[0.5px] border-white/10 bg-[rgba(30,30,30,0.75)] p-6">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-[15px] font-normal text-white">Request Health</h3>
                                <div className="flex items-center gap-4">
                                    <div className="flex items-center gap-1.5">
                                        <div className="h-2.5 w-2.5 rounded-full bg-[#2c75e4]" />
                                        <span className="text-[10px] font-medium text-white/60 tracking-[-0.2px]">Success</span>
                                    </div>
                                    <div className="flex items-center gap-1.5">
                                        <div className="h-2.5 w-2.5 rounded-full bg-[#e41010]" />
                                        <span className="text-[10px] font-medium text-[rgba(255,251,251,0.6)] tracking-[-0.2px]">Invalid</span>
                                    </div>
                                </div>
                            </div>
                            <ChartContainer
                                config={{
                                    success: {
                                        label: "Success",
                                        color: "#2c75e4",
                                    },
                                    invalid: {
                                        label: "Invalid",
                                        color: "#e41010",
                                    },
                                }}
                                className="h-[220px] w-full"
                            >
                                <AreaChart
                                    data={[
                                        { time: "00", success: 30, invalid: 15 },
                                        { time: "04", success: 45, invalid: 20 },
                                        { time: "08", success: 55, invalid: 18 },
                                        { time: "12", success: 70, invalid: 25 },
                                        { time: "16", success: 85, invalid: 22 },
                                        { time: "20", success: 90, invalid: 20 },
                                        { time: "24", success: 95, invalid: 18 },
                                    ]}
                                >
                                    <defs>
                                        <linearGradient id="successGradient" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="0%" stopColor="#2c75e4" stopOpacity={0.8} />
                                            <stop offset="100%" stopColor="#1e3a5f" stopOpacity={0.2} />
                                        </linearGradient>
                                        <linearGradient id="invalidGradient" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="0%" stopColor="#e41010" stopOpacity={0.6} />
                                            <stop offset="100%" stopColor="#5a0808" stopOpacity={0.1} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="0" stroke="rgba(255,255,255,0.1)" vertical={false} />
                                    <XAxis
                                        dataKey="time"
                                        stroke="#6d7280"
                                        fontSize={10}
                                        tickLine={false}
                                        axisLine={false}
                                    />
                                    <YAxis
                                        stroke="#6d7280"
                                        fontSize={10}
                                        tickLine={false}
                                        axisLine={false}
                                    />
                                    <ChartTooltip content={<ChartTooltipContent />} />
                                    <Area
                                        type="monotone"
                                        dataKey="success"
                                        stroke="#2c75e4"
                                        strokeWidth={2}
                                        fill="url(#successGradient)"
                                    />
                                    <Area
                                        type="monotone"
                                        dataKey="invalid"
                                        stroke="#e41010"
                                        strokeWidth={2}
                                        fill="url(#invalidGradient)"
                                    />
                                </AreaChart>
                            </ChartContainer>
                        </div>
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    )
}