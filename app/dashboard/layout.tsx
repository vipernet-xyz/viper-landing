'use client'

import { SidebarProvider, SidebarInset, SidebarTrigger } from '@/components/ui/sidebar'
import { DashboardSidebar } from '@/components/dashboard/DashboardSidebar'
import { useAuth } from '@/components/auth/AuthProvider'
import { useRouter, usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Loader2, FileText, ExternalLink } from 'lucide-react'
import { Separator } from '@/components/ui/separator'
import { toast } from 'sonner'
import { useChain } from '@cosmos-kit/react'

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const { user, isLoading, provider } = useAuth()
    const { isWalletConnected: cosmosConnected, address: cosmosAddress } = useChain('cosmoshub')
    const router = useRouter()
    const pathname = usePathname()
    const [walletAddress, setWalletAddress] = useState<string>('')

    // Get EVM wallet address
    useEffect(() => {
        const getWalletAddress = async () => {
            if (provider && user) {
                try {
                    const ethProvider = provider as any
                    const accounts = await ethProvider.request({ method: 'eth_accounts' })
                    if (accounts && accounts.length > 0) {
                        setWalletAddress(accounts[0])
                    }
                } catch (error) {
                    console.error('Error getting wallet address:', error)
                }
            }
        }
        getWalletAddress()
    }, [provider, user])

    // Redirect to login if neither wallet is connected
    useEffect(() => {
        if (!isLoading && !user && !cosmosConnected) {
            router.push('/login')
        }
    }, [user, isLoading, cosmosConnected, router])

    // Show loading only if Web3Auth is still loading AND Cosmos is not connected
    if (isLoading && !cosmosConnected) {
        return (
            <div className="flex h-screen w-full items-center justify-center bg-black">
                <Loader2 className="h-8 w-8 animate-spin text-indigo-500" />
            </div>
        )
    }

    // If neither authentication method is active, don't render
    if (!user && !cosmosConnected) {
        return null
    }

    // Determine which address to display (Cosmos takes priority if both are connected)
    const displayAddress = cosmosAddress || walletAddress

    return (
        <SidebarProvider>
            <DashboardSidebar />
            <SidebarInset className="bg-viper-bg-primary">
                <header className="flex h-20 shrink-0 items-center gap-2 px-6 border-b border-white/10">
                    <div className="flex-1 flex items-center justify-between">
                        {pathname === '/dashboard' && (
                            <h1 className="text-xl font-medium text-white">Hi There!</h1>
                        )}
                        <div className={`flex items-center gap-4 ${pathname !== '/dashboard' ? 'ml-auto' : ''}`}>
                            {/* User Wallet Address */}
                            <div className="flex items-center gap-2 h-8 px-3 bg-[#1c1b1b] border border-white/10 rounded text-white/70 text-[10px] font-medium">
                                <span>
                                    {displayAddress
                                        ? displayAddress.startsWith('cosmos')
                                            ? `${displayAddress.slice(0, 8)}...${displayAddress.slice(-6)}`
                                            : `${displayAddress.slice(0, 6)}...${displayAddress.slice(-4)}`
                                        : user?.email?.split('@')[0] || 'User'
                                    }
                                </span>
                                <button
                                    className="hover:opacity-80 transition-opacity"
                                    onClick={() => {
                                        const addressToCopy = displayAddress || user?.email || ''
                                        if (addressToCopy) {
                                            navigator.clipboard.writeText(addressToCopy)
                                            toast.success('Address copied to clipboard!')
                                        }
                                    }}
                                >
                                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                                        <path d="M10 4.5V2C10 1.44772 9.55228 1 9 1H2C1.44772 1 1 1.44772 1 2V9C1 9.55228 1.44772 10 2 10H4.5M7 11H10C10.5523 11 11 10.5523 11 10V7C11 6.44772 10.5523 6 10 6H7C6.44772 6 6 6.44772 6 7V10C6 10.5523 6.44772 11 7 11Z" stroke="rgba(255,255,255,0.7)" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"/>
                                    </svg>
                                </button>
                            </div>

                            {/* Social/Docs Icons */}
                            <div className="flex items-center gap-2">
                                <button
                                    className="flex items-center justify-center w-8 h-8 hover:bg-white/5 rounded transition-colors"
                                    onClick={() => window.open('https://docs.vipernet.xyz', '_blank')}
                                >
                                    <FileText className="w-4 h-4 text-white/70" />
                                </button>
                                <button
                                    className="flex items-center justify-center w-8 h-8 hover:bg-white/5 rounded transition-colors"
                                    onClick={() => window.open('https://x.com/viper_network_', '_blank')}
                                >
                                    <ExternalLink className="w-4 h-4 text-white/70" />
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
