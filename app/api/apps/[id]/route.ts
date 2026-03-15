import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { cookies } from 'next/headers'
import { readVerifiedSession } from '@/lib/auth/session'

function serializeApp(app: any) {
    return {
        ...app,
        id: Number(app.id),
        user_id: Number(app.user_id),
        rate_limit: Number(app.rate_limit),
    }
}

export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const cookieStore = await cookies()
        const session = readVerifiedSession(cookieStore)

        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }
        const userId = session.userId
        const { id } = await params
        const appId = parseInt(id)

        if (isNaN(appId)) {
            return NextResponse.json({ error: 'Invalid app ID' }, { status: 400 })
        }

        const apps: any[] = await prisma.$queryRaw`
            SELECT * FROM apps
            WHERE id = ${appId} AND user_id = ${userId}
        `

        if (apps.length === 0) {
            return NextResponse.json({ error: 'App not found' }, { status: 404 })
        }

        return NextResponse.json(serializeApp(apps[0]))
    } catch (error) {
        console.error('Get App error:', error)
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }
}
