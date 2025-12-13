'use client'

import { SidebarProvider, SidebarInset, SidebarTrigger } from '@/components/ui/sidebar'
import { DashboardSidebar } from '@/components/dashboard/DashboardSidebar'
import { useAuth } from '@/components/auth/AuthProvider'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { Loader2 } from 'lucide-react'
import { Separator } from '@/components/ui/separator'

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const { user, isLoading } = useAuth()
    const router = useRouter()

    useEffect(() => {
        if (!isLoading && !user) {
            router.push('/login')
        }
    }, [user, isLoading, router])

    if (isLoading || !user) {
        return (
            <div className="flex h-screen w-full items-center justify-center bg-black">
                <Loader2 className="h-8 w-8 animate-spin text-indigo-500" />
            </div>
        )
    }

    return (
        <SidebarProvider>
            <DashboardSidebar />
            <SidebarInset className="bg-viper-bg-primary">
                <header className="flex h-20 shrink-0 items-center gap-2 border-b border-white px-6">
                    <div className="flex-1 flex items-center justify-between">
                        <h1 className="text-xl font-medium text-white">Hi There!</h1>
                        <div className="flex items-center gap-4">
                            {/* VIPR Balance */}
                            <div className="flex items-center gap-2 text-white/70 text-[10px] font-medium">
                                <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                                    <circle cx="16" cy="16" r="16" fill="url(#vipr-gradient)" />
                                    <defs>
                                        <linearGradient id="vipr-gradient" x1="0" y1="0" x2="32" y2="32">
                                            <stop offset="0%" stopColor="#7f5ee3" />
                                            <stop offset="100%" stopColor="#46337d" />
                                        </linearGradient>
                                    </defs>
                                </svg>
                                <span>100 VIPR</span>
                            </div>

                            {/* Wallet Address */}
                            <div className="flex items-center gap-2 h-8 px-3 bg-[#1c1b1b] border border-white/10 rounded text-white/70 text-[10px] font-medium">
                                <span>viper7F69...61e46A</span>
                                <button className="hover:opacity-80 transition-opacity">
                                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                                        <path d="M10 4.5V2C10 1.44772 9.55228 1 9 1H2C1.44772 1 1 1.44772 1 2V9C1 9.55228 1.44772 10 2 10H4.5M7 11H10C10.5523 11 11 10.5523 11 10V7C11 6.44772 10.5523 6 10 6H7C6.44772 6 6 6.44772 6 7V10C6 10.5523 6.44772 11 7 11Z" stroke="rgba(255,255,255,0.7)" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"/>
                                    </svg>
                                </button>
                            </div>
                        </div>
                    </div>
                </header>
                <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
                    {children}
                </div>
            </SidebarInset>
        </SidebarProvider>
    )
}
