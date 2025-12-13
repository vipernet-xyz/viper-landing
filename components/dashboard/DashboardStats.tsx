'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ChevronRight } from 'lucide-react'
import Image from 'next/image'

export function DashboardStats() {
    return (
        <div 
            className="relative overflow-hidden rounded-[10px] min-h-[334px]"
            style={{
                backgroundImage: 'url(/assets/backgrounds/stats-bg.svg)',
                backgroundSize: 'cover',
                backgroundPosition: 'center'
            }}
        >
            {/* Header */}
            <div className="relative p-6 pb-4">
                <div className="flex items-center justify-between">
                    <h3 className="text-white text-[15px] font-normal">About Viper Network</h3>
                    <Button 
                        size="sm" 
                        className="h-5 px-2 text-[8px] font-medium bg-viper-purple hover:bg-viper-purple-dark text-white border-0 rounded gap-1"
                    >
                        Apps
                        <ChevronRight className="size-2.5" strokeWidth={2} />
                    </Button>
                </div>
            </div>

            <div className="relative px-6 pb-6">
                <div className="grid grid-cols-12 gap-4">
                    {/* Left Column Stats */}
                    <div className="col-span-7 grid grid-cols-2 gap-4">
                        {/* Large Stat - Total Relays */}
                        <div className="col-span-2 p-6 rounded-[10px] bg-[rgba(37,37,37,0.5)] backdrop-blur-sm">
                            <div className="text-[30px] font-normal text-white mb-2 font-['Space_Grotesk']">33.2M+</div>
                            <div className="text-[11px] text-white/70 font-normal mt-auto">Total Relays Serviced</div>
                        </div>

                        {/* Bottom Row - Availability and Chains */}
                        <div className="p-4 rounded-[10px] bg-[rgba(37,37,37,0.5)] backdrop-blur-sm flex flex-col">
                            <div className="text-xl font-normal text-white font-['Space_Grotesk']">99.999%</div>
                            <div className="text-[10px] text-white/70 font-normal mt-auto">Availability</div>
                        </div>
                        <div className="p-4 rounded-[10px] bg-[rgba(37,37,37,0.5)] backdrop-blur-sm flex flex-col">
                            <div className="text-xl font-normal text-white font-['Space_Grotesk']">15</div>
                            <div className="text-[10px] text-white/70 font-normal mt-auto">Chains Supported</div>
                        </div>
                    </div>

                    {/* Middle Column Stats */}
                    <div className="col-span-3 space-y-4">
                        <div className="p-5 rounded-[10px] bg-[rgba(37,37,37,0.5)] backdrop-blur-sm">
                            <div className="text-[30px] font-normal text-white mb-1 font-['Space_Grotesk']">70.7k+</div>
                            <div className="text-[11px] text-white/70 font-normal">Monthly Active Users</div>
                        </div>
                        <div className="p-5 rounded-[10px] bg-[rgba(37,37,37,0.5)] backdrop-blur-sm">
                            <div className="text-[30px] font-normal text-white mb-1 font-['Space_Grotesk']">2k+</div>
                            <div className="text-[11px] text-white/70 font-normal">Total Nodes</div>
                        </div>
                    </div>

                    {/* Right Column - Connect CTA */}
                    <div className="col-span-2 bg-[rgba(37,37,37,0.5)] rounded-[10px] p-6 flex flex-col justify-between relative overflow-hidden">
                        <div className="flex items-center justify-center flex-1 py-4">
                            <div className="relative size-24">
                                <Image 
                                    src="/assets/viper-illustration.png" 
                                    alt="Viper Network" 
                                    width={96} 
                                    height={96}
                                    className="object-contain opacity-80"
                                />
                            </div>
                        </div>

                        <div className="relative z-10">
                            <h4 className="text-xl font-medium text-white mb-2">Connect To Viper</h4>
                            <p className="text-[11px] text-white/60 leading-relaxed font-normal">
                                Get fast, reliable RPC relays across multiple blockchains with a single integration.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}