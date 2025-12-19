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
        <Sidebar variant="inset" className="bg-viper-bg-sidebar border-r border-white/10">
            <SidebarHeader className="border-b border-white/10 pb-4 pt-4">
                <div className="flex items-center gap-3 px-2">
                    {/* Logo */}
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
            </SidebarHeader>
            <SidebarContent className="pt-4">
                <SidebarGroup>
                    <SidebarGroupContent>
                        <SidebarMenu className="space-y-1">
                            {items.map((item) => (
                                <SidebarMenuItem key={item.title}>
                                    <SidebarMenuButton
                                        asChild
                                        isActive={pathname === item.url}
                                        tooltip={item.title}
                                        onClick={() => router.push(item.url)}
                                        className={`h-8 transition-all duration-200 rounded-[7px] ${
                                            pathname === item.url
                                                ? 'bg-gradient-to-b from-[rgba(182,163,255,0.2)] to-[rgba(14,14,14,0.2)] text-white border border-white/20'
                                                : 'text-white/50 hover:text-white hover:bg-transparent'
                                        }`}
                                    >
                                        <button className="flex items-center gap-3 px-3 w-full">
                                            <item.icon className="size-3.5" />
                                            <span className="font-normal text-sm">{item.title}</span>
                                        </button>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>

            <SidebarFooter className="border-t-0 bg-transparent p-4">
                <div className="flex items-center gap-3 px-2">
                    <div className="flex items-center justify-center size-6 text-xl">
                        😇
                    </div>
                    <div className="flex-1 grid text-left leading-tight">
                        <span className="text-white text-sm font-normal">{user?.username || 'User'}</span>
                        <span className="text-white text-[13px] font-normal">{user?.email || 'user@example.com'}</span>
                    </div>
                </div>
            </SidebarFooter>
        </Sidebar>
    )
}