import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export async function POST() {
    const cookieStore = await cookies()
    cookieStore.delete('viper_user_id')
    cookieStore.delete('viper_wallet')

    return NextResponse.json({ success: true })
}
