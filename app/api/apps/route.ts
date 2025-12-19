import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { cookies } from 'next/headers'
import crypto from 'crypto'

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
        const userIdCookie = cookieStore.get('viper_user_id')

        if (!userIdCookie || !userIdCookie.value) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const userId = parseInt(userIdCookie.value)

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
        const userIdCookie = cookieStore.get('viper_user_id')

        if (!userIdCookie || !userIdCookie.value) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const userId = parseInt(userIdCookie.value)

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
        const userIdCookie = cookieStore.get('viper_user_id')

        if (!userIdCookie || !userIdCookie.value) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const userId = parseInt(userIdCookie.value)
        const body = await req.json()
        const { appId, allowed_chains, allowed_origins, rate_limit, is_active } = body

        if (!appId) {
            return NextResponse.json({ error: 'App ID is required' }, { status: 400 })
        }

        // Verify app belongs to user
        const existingApps: any[] = await prisma.$queryRaw`
            SELECT id FROM apps WHERE id = ${appId} AND user_id = ${userId}
        `

        if (existingApps.length === 0) {
            return NextResponse.json({ error: 'App not found or unauthorized' }, { status: 404 })
        }

        // Build update query dynamically based on provided fields
        const updates: string[] = []
        const values: any[] = []

        if (allowed_chains !== undefined) {
            const chainsJson = JSON.stringify(Array.isArray(allowed_chains) ? allowed_chains.map(String) : [])
            updates.push(`allowed_chains = '${chainsJson}'::jsonb`)
        }

        if (allowed_origins !== undefined) {
            const originsJson = JSON.stringify(Array.isArray(allowed_origins) ? allowed_origins : [])
            updates.push(`allowed_origins = '${originsJson}'::jsonb`)
        }

        if (rate_limit !== undefined) {
            updates.push(`rate_limit = ${parseInt(rate_limit)}`)
        }

        if (is_active !== undefined) {
            updates.push(`is_active = ${is_active ? 'true' : 'false'}`)
        }

        if (updates.length === 0) {
            return NextResponse.json({ error: 'No fields to update' }, { status: 400 })
        }

        updates.push(`updated_at = NOW()`)

        // Execute update using raw SQL
        const updateQuery = `
            UPDATE apps
            SET ${updates.join(', ')}
            WHERE id = ${appId} AND user_id = ${userId}
            RETURNING *
        `

        const result: any[] = await prisma.$queryRawUnsafe(updateQuery)

        if (result.length === 0) {
            return NextResponse.json({ error: 'Failed to update app' }, { status: 500 })
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
