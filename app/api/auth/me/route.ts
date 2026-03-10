import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { cookies } from 'next/headers'

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
    const userIdCookie = cookieStore.get('viper_user_id')

    if (!userIdCookie?.value) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const userId = Number.parseInt(userIdCookie.value, 10)
    if (!Number.isInteger(userId)) {
        cookieStore.delete('viper_user_id')
        cookieStore.delete('viper_wallet')
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
        where: { id: userId },
    })

    if (!user) {
        cookieStore.delete('viper_user_id')
        cookieStore.delete('viper_wallet')
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    return NextResponse.json({ user: serializeUser(user) })
}
