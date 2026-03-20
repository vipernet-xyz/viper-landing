'use client'

import { SidebarProvider, SidebarInset, SidebarTrigger } from '@/components/ui/sidebar'
import { DashboardSidebar } from '@/components/dashboard/DashboardSidebar'
import { useAuth } from '@/components/auth/AuthProvider'
import { useRouter, usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Loader2, FileText, ExternalLink, ChevronLeft } from 'lucide-react'
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
    const [showSocials, setShowSocials] = useState(false)

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
    if (isLoading && !cosmosConnected && !user) {
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
        <SidebarProvider
            style={{
                "--sidebar-width": "280px"
            } as React.CSSProperties}
        >
            <div className="flex min-h-screen w-full">
                <DashboardSidebar />
                <SidebarInset className="bg-viper-bg-primary flex flex-col flex-1 min-h-screen ml-0">
                    <header className="flex h-20 shrink-0 items-center gap-2 px-6 border-b border-white/10">
                    <div className="flex-1 flex items-center justify-between">
                        {pathname === '/dashboard' && (
                            <h1 className="text-xl font-medium text-white">Hi There!</h1>
                        )}
                        <div className={`flex items-center gap-3 ${pathname !== '/dashboard' ? 'ml-auto' : ''}`}>
                            {/* Social Icons - revealed on hover */}
                            <div className="relative flex items-center"
                                onMouseEnter={() => setShowSocials(true)}
                                onMouseLeave={() => setShowSocials(false)}
                            >
                                <div className={`flex items-center gap-1 overflow-hidden transition-all duration-300 ${showSocials ? 'max-w-[200px] opacity-100 mr-2' : 'max-w-0 opacity-0'}`}>
                                    <button
                                        className="flex items-center justify-center w-7 h-7 hover:bg-white/10 rounded transition-colors"
                                        onClick={() => window.open('https://docs.vipernet.xyz', '_blank')}
                                        title="Documentation"
                                    >
                                        <FileText className="w-3.5 h-3.5 text-white/60" />
                                    </button>
                                    <button
                                        className="flex items-center justify-center w-7 h-7 hover:bg-white/10 rounded transition-colors"
                                        onClick={() => window.open('https://x.com/viper_network_', '_blank')}
                                        title="Twitter"
                                    >
                                        <svg className="w-3.5 h-3.5 text-white/60" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                                    </button>
                                    <button
                                        className="flex items-center justify-center w-7 h-7 hover:bg-white/10 rounded transition-colors"
                                        onClick={() => window.open('https://discord.gg/vipernet', '_blank')}
                                        title="Discord"
                                    >
                                        <svg className="w-3.5 h-3.5 text-white/60" fill="currentColor" viewBox="0 0 24 24"><path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286z"/></svg>
                                    </button>
                                    <button
                                        className="flex items-center justify-center w-7 h-7 hover:bg-white/10 rounded transition-colors"
                                        onClick={() => window.open('https://github.com/vipernet-xyz', '_blank')}
                                        title="GitHub"
                                    >
                                        <svg className="w-3.5 h-3.5 text-white/60" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
                                    </button>
                                </div>
                                <button className="flex items-center justify-center w-7 h-7 hover:bg-white/5 rounded transition-colors">
                                    <ChevronLeft className={`w-4 h-4 text-white/50 transition-transform duration-300 ${showSocials ? 'rotate-0' : 'rotate-180'}`} />
                                </button>
                            </div>

                            {/* VIPR Token Badge */}
                            <div className="flex items-center h-8 px-3 bg-[#1c1b1b] border border-white/10 rounded text-white/70 text-[10px] font-medium">
                                100 VIPR
                            </div>
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
                        </div>
                    </div>
                </header>
                <div className="flex-1 w-full p-4 md:p-6 pt-5 overflow-x-hidden">
                    {children}
                </div>
                </SidebarInset>
            </div>
        </SidebarProvider>
    )
}
