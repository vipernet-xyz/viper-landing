import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { cookies } from 'next/headers'
import crypto from 'crypto'
import { readVerifiedSession } from '@/lib/auth/session'

// Helper to generate API Key
function generateAPIKey() {
    const buffer = crypto.randomBytes(32)
    return 'vpr_' + buffer.toString('hex')
}

// Helper to convert BigInt to Number in objects
function serializeApp(app: any) {
    return {
        ...app,
        id: Number(app.id),
        user_id: Number(app.user_id),
        rate_limit: Number(app.rate_limit),
    }
}

export async function GET(req: NextRequest) {
    try {
        const cookieStore = await cookies()
        const session = readVerifiedSession(cookieStore)

        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }
        const userId = session.userId

        // Use raw SQL to properly handle JSONB columns with pg adapter
        const apps: any[] = await prisma.$queryRaw`
            SELECT * FROM apps
            WHERE user_id = ${userId}
            ORDER BY created_at DESC
        `

        // Serialize BigInt values
        const serializedApps = apps.map(serializeApp)

        return NextResponse.json(serializedApps)
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
        const session = readVerifiedSession(cookieStore)

        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }
        const userId = session.userId

        const body = await req.json()
        const { name, description, allowedOrigins, allowedChains, rateLimit } = body

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

        // Use raw SQL to properly handle JSONB columns with pg adapter
        const allowedOriginsJson = JSON.stringify(Array.isArray(allowedOrigins) ? allowedOrigins : [])
        const allowedChainsJson = JSON.stringify(Array.isArray(allowedChains) ? allowedChains.map(String) : [])
        const rateLimitValue = rateLimit || 10000
        const descriptionValue = description || null

        const result: any[] = await prisma.$queryRaw`
            INSERT INTO apps (
                user_id,
                name,
                description,
                api_key,
                allowed_origins,
                allowed_chains,
                rate_limit,
                created_at,
                updated_at
            )
            VALUES (
                ${userId},
                ${name},
                ${descriptionValue},
                ${apiKey},
                ${allowedOriginsJson}::jsonb,
                ${allowedChainsJson}::jsonb,
                ${rateLimitValue},
                NOW(),
                NOW()
            )
            RETURNING *
        `

        const newApp = Array.isArray(result) && result.length > 0 ? result[0] : null

        if (!newApp) {
            throw new Error('Failed to create app')
        }

        // Serialize BigInt values
        const serializedApp = serializeApp(newApp)

        return NextResponse.json(serializedApp, { status: 201 })
    } catch (error) {
        console.error('Create App error:', error)
        return NextResponse.json(
            { error: 'Internal server error', details: error instanceof Error ? error.message : String(error) },
            { status: 500 }
        )
    }
}

export async function PATCH(req: NextRequest) {
    try {
        const cookieStore = await cookies()
        const session = readVerifiedSession(cookieStore)

        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }
        const userId = session.userId
        const body = await req.json()
        const { appId, allowed_chains, allowed_origins, rate_limit, is_active } = body

        if (!appId) {
            return NextResponse.json({ error: 'App ID is required' }, { status: 400 })
        }

        // Prepare parameterized values - COALESCE keeps existing value when param is null
        const chainsParam = allowed_chains !== undefined
            ? JSON.stringify(Array.isArray(allowed_chains) ? allowed_chains.map(String) : [])
            : null
        const originsParam = allowed_origins !== undefined
            ? JSON.stringify(Array.isArray(allowed_origins) ? allowed_origins : [])
            : null
        const rateLimitParam = rate_limit !== undefined ? parseInt(rate_limit) : null
        const isActiveParam = is_active !== undefined ? is_active : null

        if (chainsParam === null && originsParam === null && rateLimitParam === null && isActiveParam === null) {
            return NextResponse.json({ error: 'No fields to update' }, { status: 400 })
        }

        // Fully parameterized query - no string interpolation
        const result: any[] = await prisma.$queryRaw`
            UPDATE apps
            SET
                allowed_chains = COALESCE(${chainsParam}::jsonb, allowed_chains),
                allowed_origins = COALESCE(${originsParam}::jsonb, allowed_origins),
                rate_limit = COALESCE(${rateLimitParam}::bigint, rate_limit),
                is_active = COALESCE(${isActiveParam}::boolean, is_active),
                updated_at = NOW()
            WHERE id = ${appId} AND user_id = ${userId}
            RETURNING *
        `

        if (result.length === 0) {
            return NextResponse.json({ error: 'App not found or unauthorized' }, { status: 404 })
        }

        const serializedApp = serializeApp(result[0])
        return NextResponse.json(serializedApp, { status: 200 })
    } catch (error) {
        console.error('Update App error:', error)
        return NextResponse.json(
            { error: 'Internal server error', details: error instanceof Error ? error.message : String(error) },
            { status: 500 }
        )
    }
}

export async function DELETE(req: NextRequest) {
    try {
        const cookieStore = await cookies()
        const session = readVerifiedSession(cookieStore)

        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }
        const userId = session.userId
        const { searchParams } = new URL(req.url)
        const appId = searchParams.get('appId')

        if (!appId) {
            return NextResponse.json({ error: 'App ID is required' }, { status: 400 })
        }

        const appIdNum = parseInt(appId)

        // Verify ownership
        const existingApps: any[] = await prisma.$queryRaw`
            SELECT id FROM apps WHERE id = ${appIdNum} AND user_id = ${userId}
        `

        if (existingApps.length === 0) {
            return NextResponse.json({ error: 'App not found or unauthorized' }, { status: 404 })
        }

        // Delete child records first (FK constraints use onDelete: NoAction)
        await prisma.$queryRaw`DELETE FROM relay_logs WHERE app_id = ${appIdNum}`
        await prisma.$queryRaw`DELETE FROM web_socket_sessions WHERE app_id = ${appIdNum}`
        await prisma.$queryRaw`DELETE FROM apps WHERE id = ${appIdNum} AND user_id = ${userId}`

        return NextResponse.json({ success: true }, { status: 200 })
    } catch (error) {
        console.error('Delete App error:', error)
        return NextResponse.json(
            { error: 'Internal server error', details: error instanceof Error ? error.message : String(error) },
            { status: 500 }
        )
    }
}
