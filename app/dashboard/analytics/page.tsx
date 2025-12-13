'use client'

import { TrendingUp } from 'lucide-react'
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from 'recharts'
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart'

export default function AnalyticsPage() {
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
                            70.7k+
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
                            99.99%
                        </div>
                        <div className="flex items-center justify-between">
                            <div className="text-[11px] font-normal text-white">
                                Success Rate
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
                            Average Response Time
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
                            Invalid Rquests
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