import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { cookies } from 'next/headers'
import crypto from 'crypto'

// Helper to generate API Key
function generateAPIKey() {
    const buffer = crypto.randomBytes(32)
    return 'vpr_' + buffer.toString('hex')
}

export async function GET(req: NextRequest) {
    try {
        const cookieStore = await cookies()
        const userIdCookie = cookieStore.get('viper_user_id')

        if (!userIdCookie || !userIdCookie.value) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const userId = parseInt(userIdCookie.value)

        const apps = await prisma.app.findMany({
            where: {
                user_id: userId,
            },
            orderBy: {
                created_at: 'desc',
            },
        })

        return NextResponse.json(apps)
    } catch (error) {
        console.error('Get Apps error:', error)
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }
}

export async function POST(req: NextRequest) {
    try {
        const cookieStore = await cookies()
        const userIdCookie = cookieStore.get('viper_user_id')

        if (!userIdCookie || !userIdCookie.value) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const userId = parseInt(userIdCookie.value)

        const body = await req.json()
        const { name, description, allowedOrigins, allowedChains } = body

        if (!name) {
            return NextResponse.json({ error: 'Name is required' }, { status: 400 })
        }

        // Check app limit
        const user = await prisma.user.findUnique({
            where: { id: userId },
            include: { _count: { select: { apps: true } } }
        })

        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 })
        }

        if (user._count.apps >= user.app_limit) {
            return NextResponse.json({ error: 'App limit reached' }, { status: 403 })
        }

        const apiKey = generateAPIKey()

        const newApp = await prisma.app.create({
            data: {
                user_id: userId,
                name,
                description,
                api_key: apiKey,
                allowed_origins: allowedOrigins || [],
                allowed_chains: allowedChains || [],
                rate_limit: 10000, // Default
            },
        })

        return NextResponse.json(newApp, { status: 201 })
    } catch (error) {
        console.error('Create App error:', error)
        return NextResponse.json(
            { error: 'Internal server error', details: error instanceof Error ? error.message : String(error) },
            { status: 500 }
        )
    }
}
