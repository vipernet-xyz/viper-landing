'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useChain } from '@cosmos-kit/react'
import Image from 'next/image'
import {
    LayoutDashboard,
    Layers,
    Link as LinkIcon,
    BarChart2,
    BookOpen,
    MessageSquare,
    Loader2,
} from 'lucide-react'
import { useAuth } from '@/components/auth/AuthProvider'
import { CosmosConnectButton } from '@/components/wallet/CosmosConnectButton'
import { Button } from '@/components/ui/button'
import { DashboardStats } from '@/components/dashboard/DashboardStats'

export default function LoginPage() {
    const { login, user, isLoading, web3auth, authError } = useAuth()
    const { isWalletConnected: cosmosConnected } = useChain('cosmoshub')
    const router = useRouter()
    const isWeb3AuthAvailable = Boolean(web3auth) && !isLoading

    useEffect(() => {
        if (user || cosmosConnected) {
            router.push('/dashboard')
        }
    }, [user, cosmosConnected, router])

    const handleLogin = () => {
        if (isWeb3AuthAvailable) {
            login()
        }
    }

    const menuItems = [
        { title: 'Dashboard', icon: LayoutDashboard },
        { title: 'Apps', icon: Layers },
        { title: 'Chains', icon: LinkIcon },
        { title: 'Analytics', icon: BarChart2 },
        { title: 'Documentation', icon: BookOpen },
        { title: 'Support Ticket', icon: MessageSquare },
    ]

    return (
        <div className="min-h-screen bg-[#0a0a0a] flex">
            {/* Sidebar */}
            <div className="flex w-[280px] flex-col flex-shrink-0 bg-[#0f0f0f] border-r border-white/10">
                {/* Logo */}
                <div className="h-20 flex items-center border-b border-white/10 px-6">
                    <div className="flex items-center gap-3">
                        <div className="relative flex aspect-square size-7 items-center justify-center">
                            <Image
                                src="/assets/viper-logo.png"
                                alt="Viper Network Logo"
                                width={28}
                                height={28}
                                className="object-contain"
                            />
                        </div>
                        <span className="text-xl font-normal text-white font-['Space_Grotesk']">
                            Viper Network
                        </span>
                    </div>
                </div>

                {/* Menu Items */}
                <div className="flex-1 px-5 pt-5">
                    <div className="space-y-3">
                        {menuItems.map((item, idx) => (
                            <div
                                key={item.title}
                                className={`flex h-11 items-center gap-3 rounded-[8px] px-3 text-[15px] font-normal ${
                                    idx === 0
                                        ? 'bg-gradient-to-r from-[rgba(127,94,227,0.2)] to-[rgba(127,94,227,0.05)] text-white'
                                        : 'text-white/40'
                                }`}
                            >
                                <item.icon className="size-5" />
                                <span>{item.title}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Login Button */}
                <div className="p-4">
                    <Button
                        className="h-11 w-full rounded-[8px] bg-[#7f5ee3] font-medium text-white text-[15px] hover:bg-[#6b4dcf] cursor-pointer"
                        onClick={handleLogin}
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Initializing...
                            </>
                        ) : (
                            'Login'
                        )}
                    </Button>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 flex flex-col min-h-screen">
                {/* Header */}
                <header className="flex h-20 shrink-0 items-center border-b border-white/10 px-6">
                    <div className="flex flex-1 items-center justify-between">
                        <h1 className="text-[22px] font-medium text-white">Hi There!</h1>
                        <div className="flex items-center gap-3">
                            <div className="flex items-center gap-2">
                                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-r from-[#7f5ee3] to-[#5e3eb5] text-xs font-bold text-white">
                                    V
                                </div>
                                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-r from-[#5e3eb5] to-[#3eb5b5] text-xs font-bold text-white">
                                    L
                                </div>
                            </div>
                            <CosmosConnectButton className="h-9 rounded-[8px] bg-[#7f5ee3] px-5 font-medium text-white text-sm hover:bg-[#6b4dcf]" />
                        </div>
                    </div>
                </header>

                {/* Dashboard Content (visible behind login state) */}
                <div className="flex-1 p-6 overflow-y-auto">
                    {/* Dashboard Heading */}
                    <h2 className="text-[22px] font-medium text-white mb-6">Dashboard</h2>

                    {/* Stats Section */}
                    <div className="w-full mb-10">
                        <DashboardStats />
                    </div>

                    {/* "Not logged in" overlay */}
                    <div className="flex flex-col items-center justify-center py-8">
                        <div className="mb-6 flex justify-center">
                            <div className="relative">
                                <div className="absolute inset-0 h-24 w-24 rounded-full bg-gradient-to-r from-purple-600/20 to-cyan-600/20 blur-lg"></div>
                                <div className="relative flex h-24 w-24 items-center justify-center rounded-full border border-white/10">
                                    <div className="flex h-[72px] w-[72px] items-center justify-center rounded-full bg-gradient-to-br from-[#7f5ee3] to-[#3eb5b5]">
                                        <svg className="h-7 w-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                                        </svg>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <h2 className="mb-2 text-[22px] font-medium text-white">You are not logged in</h2>
                        <p className="text-sm text-white/50">Please login to continue</p>
                    </div>
                </div>
            </div>
        </div>
    )
}
