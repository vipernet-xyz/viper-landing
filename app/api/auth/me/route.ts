import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { cookies } from 'next/headers'
import { clearAuthCookies, readVerifiedSession } from '@/lib/auth/session'

export const runtime = 'nodejs'

function serializeUser(user: any) {
    return {
        ...user,
        id: Number(user.id),
        verifierId: user.provider_user_id,
        daily_rate_limit: Number(user.daily_rate_limit),
        app_limit: Number(user.app_limit),
    }
}

export async function GET() {
    const cookieStore = await cookies()
    const session = readVerifiedSession(cookieStore)

    if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
        where: { id: session.userId },
    })

    if (!user) {
        clearAuthCookies(cookieStore)
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    return NextResponse.json({ user: serializeUser(user) })
}
