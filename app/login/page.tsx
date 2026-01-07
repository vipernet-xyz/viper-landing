'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/components/auth/AuthProvider'
import { CosmosConnectButton } from '@/components/wallet/CosmosConnectButton'
import { Button } from '@/components/ui/button'
import { LayoutDashboard, Layers, Link as LinkIcon, BarChart2, BookOpen, MessageSquare, Loader2 } from 'lucide-react'
import Image from 'next/image'
import { useChain } from '@cosmos-kit/react'

export default function LoginPage() {
    const { login, user, isLoading, web3auth } = useAuth()
    const { isWalletConnected: cosmosConnected } = useChain('cosmoshub')
    const router = useRouter()

    useEffect(() => {
        // Redirect if either Web3Auth or Cosmos wallet is connected
        if ((user && !isLoading) || cosmosConnected) {
            router.push('/dashboard')
        }
    }, [user, isLoading, cosmosConnected, router])

    const menuItems = [
        { title: 'Dashboard', icon: LayoutDashboard },
        { title: 'Apps', icon: Layers },
        { title: 'Chains', icon: LinkIcon },
        { title: 'Analytics', icon: BarChart2 },
        { title: 'Documentation', icon: BookOpen },
        { title: 'Support Ticket', icon: MessageSquare },
    ]

    return (
        <div className="flex h-screen bg-viper-bg-primary">
            {/* Sidebar */}
            <div className="w-[200px] bg-viper-bg-sidebar border-r border-white/10 flex flex-col">
                {/* Logo */}
                <div className="border-b border-white/10 pb-4 pt-4 px-4">
                    <div className="flex items-center gap-3 px-2">
                        <div className="relative flex aspect-square size-7 items-center justify-center">
                            <Image
                                src="/assets/viper-logo.png"
                                alt="Viper Network"
                                width={28}
                                height={28}
                                className="object-contain"
                            />
                        </div>
                        <div className="grid flex-1 text-left leading-tight">
                            <span className="truncate font-normal text-xl text-white tracking-normal font-['Space_Grotesk']">Viper Network</span>
                        </div>
                    </div>
                </div>

                {/* Menu Items */}
                <div className="flex-1 pt-4 px-4">
                    <div className="space-y-1">
                        {menuItems.map((item) => (
                            <div
                                key={item.title}
                                className="flex items-center gap-3 px-3 h-8 text-white/50 text-sm font-normal rounded-[7px]"
                            >
                                <item.icon className="size-3.5" />
                                <span>{item.title}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Login Buttons */}
                <div className="p-4 space-y-2">
                    <Button
                        className="w-full h-10 bg-viper-purple hover:bg-viper-purple-dark text-white font-medium rounded-[7px]"
                        onClick={login}
                        disabled={isLoading || !web3auth}
                    >
                        {isLoading ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Loading...
                            </>
                        ) : (
                            <>
                                <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M12 0L1.608 6v12L12 24l10.392-6V6L12 0zm0 4.5L19.2 8.5v7L12 19.5l-7.2-4v-7L12 4.5z"/>
                                </svg>
                                Web3Auth (Ethereum)
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
                    <CosmosConnectButton className="w-full h-10 bg-viper-purple hover:bg-viper-purple-dark text-white font-medium rounded-[7px]" />
                    <p className="text-[10px] text-center text-white/40 mt-2">
                        Supports Cosmos Hub, Osmosis, Juno, and more Cosmos chains
                    </p>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 flex flex-col">
                {/* Header */}
                <header className="flex h-20 shrink-0 items-center gap-2 px-6 border-b border-white/10">
                    <div className="flex-1 flex items-center justify-between">
                        <h1 className="text-xl font-medium text-white">Hi There!</h1>
                        <div className="flex items-center gap-4">
                            {/* Wallet Icons */}
                            <div className="flex items-center gap-2">
                                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 flex items-center justify-center text-white text-xs font-bold">
                                    V
                                </div>
                                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 flex items-center justify-center text-white text-xs font-bold">
                                    L
                                </div>
                            </div>
                            <CosmosConnectButton className="h-9 bg-viper-purple hover:bg-viper-purple-dark text-white font-medium rounded-[7px] px-4" />
                        </div>
                    </div>
                </header>

                {/* Dashboard Preview */}
                <div className="flex-1 p-8 flex items-center justify-center">
                    <div className="text-center">
                        <div className="mb-8 flex justify-center">
                            <div className="w-20 h-20 rounded-full bg-gradient-to-r from-purple-500/20 to-cyan-500/20 flex items-center justify-center border border-purple-500/30">
                                <svg className="w-10 h-10 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <circle cx="12" cy="12" r="10" strokeWidth="2" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01" />
                                </svg>
                            </div>
                        </div>
                        <h2 className="text-2xl font-medium text-white mb-2">You are not logged in</h2>
                        <p className="text-white/60 text-sm mb-6">Please login to continue</p>
                    </div>
                </div>
            </div>
        </div>
    )
}
