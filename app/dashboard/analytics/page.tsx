'use client'

import { TrendingUp } from 'lucide-react'
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from 'recharts'
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart'
import { useQuery } from '@tanstack/react-query'

interface AnalyticsData {
    analytics: {
        total_requests_24h: number
        failed_requests_24h: number
        avg_response_time: number
        requests_by_chain: Array<{ chain_id: string; count: number }>
        hourly_data: Array<{ hour: string; total: number; success: number; failed: number }>
    }
}

export default function AnalyticsPage() {
    const { data, isLoading } = useQuery<AnalyticsData>({
        queryKey: ['user-analytics'],
        queryFn: async () => {
            const res = await fetch('/api/analytics')
            if (!res.ok) throw new Error('Failed to fetch analytics')
            return res.json()
        },
        refetchInterval: 30000, // Refetch every 30 seconds
    })

    const analytics = data?.analytics
    const successRate = analytics
        ? ((analytics.total_requests_24h - analytics.failed_requests_24h) / analytics.total_requests_24h * 100).toFixed(2)
        : '0.00'

    // Format hourly data for charts
    const chartData = analytics?.hourly_data?.map(item => {
        const date = new Date(item.hour)
        return {
            time: date.getHours().toString().padStart(2, '0'),
            value: item.total,
            success: item.success,
            invalid: item.failed
        }
    }) || []

    // Calculate cumulative data for "Total Number of Relays" chart
    let cumulative = 0
    const cumulativeChartData = chartData.map(item => {
        cumulative += item.value
        return {
            time: item.time,
            value: cumulative
        }
    })

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-64">
                <p className="text-white/50 text-sm">Loading analytics...</p>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            {/* Page Title */}
            <h2 className="text-xl font-medium text-white">Analytics Overview</h2>

            {/* Metrics Cards */}
            <div className="grid grid-cols-4 gap-4">
                {/* Total Requests */}
                <div className="rounded-[10px] border-[0.5px] border-white/10 bg-[#1e1e1e] p-6 shadow-[inset_0px_-60px_60px_rgba(127,94,227,0.2)]">
                    <div className="space-y-4">
                        <div className="text-[30px] font-normal text-white font-['Space_Grotesk']">
                            {analytics?.total_requests_24h?.toLocaleString() || '0'}
                        </div>
                        <div className="text-[11px] font-normal text-white">
                            Total Requests
                        </div>
                    </div>
                </div>

                {/* Success Rate */}
                <div className="rounded-[10px] border-[0.5px] border-white/10 bg-[#1e1e1e] p-6 shadow-[inset_0px_-60px_60px_rgba(127,94,227,0.2)]">
                    <div className="space-y-4">
                        <div className="text-[30px] font-normal text-white font-['Space_Grotesk']">
                            {successRate}%
                        </div>
                        <div className="flex items-center justify-between">
                            <div className="text-[11px] font-normal text-white">
                                Success Rate
                            </div>
                            {parseFloat(successRate) >= 99 && (
                                <div className="flex items-center gap-1 h-[18px] px-2 bg-[#1e1e1e] border-[0.527px] border-white/20 rounded-[4px]">
                                    <TrendingUp className="h-2 w-2 text-green-400" />
                                    <span className="text-[6px] font-normal text-green-400">High</span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Average Response Time */}
                <div className="rounded-[10px] border-[0.5px] border-white/10 bg-[#1e1e1e] p-6 shadow-[inset_0px_-60px_60px_rgba(127,94,227,0.2)]">
                    <div className="space-y-4">
                        <div className="text-[30px] font-normal text-white font-['Space_Grotesk']">
                            {analytics?.avg_response_time || 0} ms
                        </div>
                        <div className="text-[11px] font-normal text-white">
                            Average Response Time
                        </div>
                    </div>
                </div>

                {/* Invalid Requests */}
                <div className="rounded-[10px] border-[0.5px] border-white/10 bg-[#1e1e1e] p-6 shadow-[inset_0px_-60px_60px_rgba(127,94,227,0.2)]">
                    <div className="space-y-4">
                        <div className="text-[30px] font-normal text-white font-['Space_Grotesk']">
                            {analytics?.failed_requests_24h || 0}
                        </div>
                        <div className="text-[11px] font-normal text-white">
                            Invalid Requests
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
                        className="h-[260px] w-full"
                    >
                        <AreaChart
                            data={cumulativeChartData.length > 0 ? cumulativeChartData : [{ time: "00", value: 0 }]}
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
                                <span className="text-[10px] font-medium text-[#4b5563] tracking-[-0.2px]">Success</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                                <div className="h-2.5 w-2.5 rounded-full bg-[#e41010]" />
                                <span className="text-[10px] font-medium text-[#4b5563] tracking-[-0.2px]">Invalid</span>
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
                        className="h-[260px] w-full"
                    >
                        <AreaChart
                            data={chartData.length > 0 ? chartData : [{ time: "00", success: 0, invalid: 0 }]}
                        >
                            <defs>
                                <linearGradient id="successGradientMain" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%" stopColor="#2c75e4" stopOpacity={0.8} />
                                    <stop offset="100%" stopColor="#1e3a5f" stopOpacity={0.2} />
                                </linearGradient>
                                <linearGradient id="invalidGradientMain" x1="0" y1="0" x2="0" y2="1">
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
                                fill="url(#successGradientMain)"
                            />
                            <Area
                                type="monotone"
                                dataKey="invalid"
                                stroke="#e41010"
                                strokeWidth={2}
                                fill="url(#invalidGradientMain)"
                            />
                        </AreaChart>
                    </ChartContainer>
                </div>
            </div>
        </div>
    )
}