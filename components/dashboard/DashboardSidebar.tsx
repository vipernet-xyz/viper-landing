'use client'

import React from 'react'
import { LayoutDashboard, Layers, Link as LinkIcon, BarChart2, BookOpen, MessageSquare, LogOut } from 'lucide-react'
import { useRouter, usePathname } from 'next/navigation'
import { useAuth } from '@/components/auth/AuthProvider'
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuItem,
    SidebarMenuButton,
    SidebarGroup,
    SidebarGroupContent,
} from '@/components/ui/sidebar'
import { Button } from '@/components/ui/button'
import Image from 'next/image'

export function DashboardSidebar() {
    const router = useRouter()
    const pathname = usePathname()
    const { logout, user } = useAuth()

    const handleLogout = async () => {
        await logout()
        router.push('/login')
    }

    const items = [
        {
            title: 'Dashboard',
            url: '/dashboard',
            icon: LayoutDashboard,
        },
        {
            title: 'Apps',
            url: '/dashboard/apps',
            icon: Layers,
        },
        {
            title: 'Chains',
            url: '/dashboard/chains',
            icon: LinkIcon,
        },
        {
            title: 'Analytics',
            url: '/dashboard/analytics',
            icon: BarChart2,
        },
        {
            title: 'Documentation',
            url: '/dashboard/docs',
            icon: BookOpen,
        },
        {
            title: 'Support Ticket',
            url: '/dashboard/support',
            icon: MessageSquare,
        },
    ]

    return (
        <Sidebar variant="inset" collapsible="none" className="w-[280px] flex-shrink-0 bg-viper-bg-sidebar border-r border-white/10">
            <SidebarHeader className="pb-4 pt-4 h-20 flex items-center border-b border-white/10">
                <div className="flex items-center gap-3 px-2">
                    {/* Logo */}
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
                        <span className="truncate font-normal text-xl text-white tracking-normal font-['Space_Grotesk']">Viper Network</span>
                    </div>
                </div>
            </SidebarHeader>
            <SidebarContent className="pt-5">
                <SidebarGroup>
                    <SidebarGroupContent>
                        <SidebarMenu className="space-y-3 px-1">
                            {items.map((item) => (
                                <SidebarMenuItem key={item.title} className="relative">
                                    <SidebarMenuButton
                                        asChild
                                        isActive={pathname === item.url}
                                        tooltip={item.title}
                                        onClick={() => {
                                            if (item.url === '/dashboard/docs') {
                                                window.open('https://docs.vipernet.xyz', '_blank')
                                                return
                                            }
                                            if (item.url === '/dashboard/support') {
                                                window.open('https://discord.gg/vipernet', '_blank')
                                                return
                                            }
                                            router.push(item.url)
                                        }}
                                        className={`h-11 transition-all duration-200 rounded-[8px] cursor-pointer ${
                                            pathname === item.url
                                                ? 'bg-gradient-to-r from-[rgba(127,94,227,0.2)] to-[rgba(127,94,227,0.05)] text-white'
                                                : 'text-white/40 hover:text-white hover:bg-white/5'
                                        }`}
                                    >
                                        <button className="flex items-center gap-3 px-3 w-full cursor-pointer">
                                            <item.icon className="size-5" />
                                            <span className="font-normal text-[15px]">{item.title}</span>
                                        </button>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>

            <SidebarFooter className="border-t-0 bg-transparent p-4 space-y-2">
                <div className="flex items-center gap-3 px-3 py-2 rounded-[7px] bg-white/5 border border-white/10">
                    <div className="flex items-center justify-center size-8 rounded-full bg-gradient-to-br from-[#7f5ee3] via-[#e36f5e] to-[#5ee3c8] text-white text-xs font-bold">U</div>
                    <div className="flex-1 grid text-left leading-tight">
                        <span className="text-white text-sm font-normal truncate">
                            {user?.name || user?.email?.split('@')[0] || 'User'}
                        </span>
                        <span className="text-white/60 text-[11px] font-normal truncate">
                            {user?.email || (user?.verifierId ? `${user.verifierId.slice(0, 6)}...${user.verifierId.slice(-4)}` : '')}
                        </span>
                    </div>
                </div>
                <Button
                    onClick={handleLogout}
                    variant="outline"
                    className="w-full h-9 bg-transparent hover:bg-white/5 border-white/10 text-white/70 hover:text-white text-sm font-normal cursor-pointer transition-all duration-200"
                >
                    <LogOut className="size-3.5 mr-2" />
                    Logout
                </Button>
            </SidebarFooter>
        </Sidebar>
    )
}