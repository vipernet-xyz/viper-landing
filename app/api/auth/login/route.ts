import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { cookies } from 'next/headers'

// Define a type for the user info coming from Web3Auth
interface Web3AuthUserInfo {
    idToken?: string
    verifierId?: string
    verifier?: string
    typeOfLogin?: string
    name?: string
    email?: string
    profileImage?: string
    // Add other fields as needed based on Web3Auth response
}

export async function POST(req: NextRequest) {
    try {
        const body = await req.json()
        const { userInfo } = body as { userInfo: Web3AuthUserInfo }

        if (!userInfo || !userInfo.verifierId) {
            return NextResponse.json(
                { error: 'Invalid user info', details: 'verifierId is missing' },
                { status: 400 }
            )
        }

        // verifierId is usually the wallet address or email depending on login type
        const providerUserId = userInfo.verifierId
        const email = userInfo.email || null
        const name = userInfo.name || null

        // Create or update user in DB
        const user = await prisma.user.upsert({
            where: {
                provider_user_id: providerUserId,
            },
            update: {
                email: email, // Update email if changed
                name: name,   // Update name if changed
                updated_at: new Date(),
            },
            create: {
                provider_user_id: providerUserId,
                email: email,
                name: name,
                user_type: 'free', // Default to free tier
            },
        })

        // Set session cookie
        // In a real app, you might want to create a JWT or session token here
        // For now, we'll store the User ID signed or simple ID
        const cookieStore = await cookies()
        cookieStore.set('viper_user_id', user.id.toString(), {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            path: '/',
            maxAge: 60 * 60 * 24 * 7, // 1 week
        })

        // Also store wallet/provider ID for easier client-side checks if needed (non-httpOnly)
        cookieStore.set('viper_wallet', providerUserId, {
            httpOnly: false, // Accessible to JS
            secure: process.env.NODE_ENV === 'production',
            path: '/',
            maxAge: 60 * 60 * 24 * 7,
        })

        return NextResponse.json({ user })
    } catch (error) {
        console.error('Login error:', error)
        return NextResponse.json(
            { error: 'Internal server error', details: error instanceof Error ? error.message : String(error) },
            { status: 500 }
        )
    }
}
