import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET() {
    try {
        // Get total relay logs count
        const totalRelays = await prisma.relayLog.count()

        // Get total chains count
        const totalChains = await prisma.chain.count()

        // Get unique apps that have sent relays (active users)
        const activeUsers = await prisma.relayLog.groupBy({
            by: ['app_id'],
            _count: {
                id: true
            }
        })

        return NextResponse.json({
            total_relays: totalRelays,
            total_chains: totalChains,
            monthly_active_users: activeUsers.length,
            availability: 99.999, // Static for now
            total_nodes: 2000 // Static for now
        })
    } catch (error) {
        console.error('Network stats error:', error)
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }
}
