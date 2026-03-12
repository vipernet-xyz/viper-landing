import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { issueCosmosChallenge } from '@/lib/auth/session'

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as {
      provider?: string
      address?: string
    }

    if (body.provider !== 'cosmos') {
      return NextResponse.json(
        { error: 'Unsupported auth provider', details: 'Only Cosmos challenges are supported.' },
        { status: 400 }
      )
    }

    const address = body.address?.trim()

    if (!address || !/^cosmos1[0-9a-z]{10,}$/i.test(address)) {
      return NextResponse.json(
        { error: 'Invalid wallet address', details: 'A valid Cosmos address is required.' },
        { status: 400 }
      )
    }

    const cookieStore = await cookies()
    const challenge = issueCosmosChallenge(cookieStore, address)

    return NextResponse.json(challenge)
  } catch (error) {
    console.error('❌ [AUTH/CHALLENGE] Challenge error:', error)
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    )
  }
}
