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

    const menuItems = [
        { title: 'Dashboard', icon: LayoutDashboard },
        { title: 'Apps', icon: Layers },
        { title: 'Chains', icon: LinkIcon },
        { title: 'Analytics', icon: BarChart2 },
        { title: 'Documentation', icon: BookOpen },
        { title: 'Support Ticket', icon: MessageSquare },
    ]

    return (
        <div className="min-h-screen bg-viper-bg-primary xl:flex">
            <div className="flex w-full flex-col border-b border-white/10 bg-viper-bg-sidebar xl:w-[280px] xl:border-b-0 xl:border-r">
                <div className="border-b border-white/10 px-4 pb-4 pt-4">
                    <div className="flex items-center gap-3 px-2">
                        <div className="relative flex aspect-square size-7 items-center justify-center">
                            <Image
                                src="/assets/viper-logo.png"
                                alt="Viper Network Logo"
                                width={28}
                                height={28}
                                className="object-contain"
                            />
                        </div>
                        <div className="grid flex-1 text-left leading-tight">
                            <span className="truncate text-xl font-normal tracking-normal text-white font-['Space_Grotesk']">
                                Viper Network
                            </span>
                        </div>
                    </div>
                </div>

                <div className="flex-1 px-4 pt-4">
                    <div className="space-y-1">
                        {menuItems.map((item, idx) => (
                            <div
                                key={item.title}
                                className={`flex h-10 items-center gap-3 rounded-[8px] px-3 text-[13px] font-normal ${
                                    idx === 0
                                        ? 'bg-gradient-to-r from-[rgba(127,94,227,0.25)] to-[rgba(127,94,227,0.08)] text-white'
                                        : 'text-white/50'
                                }`}
                            >
                                <item.icon className="size-4" />
                                <span>{item.title}</span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="space-y-2 p-4">
                    <Button
                        className="h-10 w-full rounded-[7px] bg-viper-purple font-medium text-white hover:bg-viper-purple-dark"
                        onClick={login}
                        disabled={isLoading || !isWeb3AuthAvailable}
                    >
                        {isLoading ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Initializing...
                            </>
                        ) : !isWeb3AuthAvailable ? (
                            'Google Login Unavailable'
                        ) : (
                            <>
                                <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                                </svg>
                                Continue with Google
                            </>
                        )}
                    </Button>

                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-white/10"></div>
                        </div>
                        <div className="relative flex justify-center text-xs">
                            <span className="bg-viper-bg-sidebar px-2 text-white/50">or</span>
                        </div>
                    </div>

                    <CosmosConnectButton className="h-10 w-full rounded-[7px] bg-viper-purple font-medium text-white hover:bg-viper-purple-dark" />

                    <p className="mt-2 text-center text-[10px] text-white/40">
                        {authError || 'Use Google for EVM access or a Cosmos wallet for Cosmos Hub flows.'}
                    </p>
                </div>
            </div>

            <div className="flex min-h-[50vh] flex-1 flex-col">
                <header className="flex h-20 shrink-0 items-center gap-2 border-b border-white/10 px-4 md:px-6">
                    <div className="flex flex-1 items-center justify-between">
                        <h1 className="text-xl font-medium text-white">Hi There!</h1>
                        <div className="flex items-center gap-3">
                            <div className="flex items-center gap-2">
                                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-r from-purple-500 to-blue-500 text-xs font-bold text-white">
                                    V
                                </div>
                                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 text-xs font-bold text-white">
                                    L
                                </div>
                            </div>
                            <CosmosConnectButton className="h-9 rounded-[7px] bg-viper-purple px-4 font-medium text-white hover:bg-viper-purple-dark" />
                        </div>
                    </div>
                </header>

                <div className="flex flex-1 items-center justify-center p-6 md:p-8">
                    <div className="text-center">
                        <div className="mb-8 flex justify-center">
                            <div className="relative">
                                <div className="absolute inset-0 h-24 w-24 rounded-full bg-gradient-to-r from-purple-600/30 to-cyan-600/30 blur-md"></div>
                                <div className="relative flex h-24 w-24 items-center justify-center rounded-full border border-purple-500/50 bg-gradient-to-r from-purple-500/40 to-cyan-500/40">
                                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-r from-purple-600 to-cyan-600">
                                        <svg className="h-8 w-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <circle cx="12" cy="12" r="10" strokeWidth="2" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01" />
                                        </svg>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <h2 className="mb-2 text-2xl font-medium text-white">You are not logged in</h2>
                        <p className="mb-6 text-sm text-white/60">Please login to continue</p>
                    </div>
                </div>
            </div>
        </div>
    )
}
