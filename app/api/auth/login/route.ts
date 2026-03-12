import crypto from 'crypto'
import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { verifyADR36Amino } from '@keplr-wallet/cosmos'
import prisma from '@/lib/prisma'
import {
  AUTH_CHALLENGE_COOKIE,
  clearAuthCookies,
  consumeCosmosChallenge,
  setSessionCookies,
} from '@/lib/auth/session'
import { verifyWeb3AuthIdToken } from '@/lib/auth/web3auth'

interface Web3AuthUserInfo {
  idToken?: string
  verifierId?: string
  verifier?: string
  typeOfLogin?: string
  name?: string
  email?: string
  profileImage?: string
}

interface CosmosSignatureInput {
  signature?: string
  pub_key?: {
    type?: string
    value?: string
  }
}

type LoginRequestBody = {
  provider?: 'web3auth' | 'cosmos'
  idToken?: string
  userInfo?: Web3AuthUserInfo
  address?: string
  challengeToken?: string
  signature?: CosmosSignatureInput
}

function serializeUser(user: any) {
  return {
    ...user,
    id: Number(user.id),
    verifierId: user.provider_user_id,
    daily_rate_limit: Number(user.daily_rate_limit),
    app_limit: Number(user.app_limit),
  }
}

function getAddressPrefix(address: string) {
  const separatorIndex = address.indexOf('1')
  return separatorIndex > 0 ? address.slice(0, separatorIndex) : null
}

function bufferFromBase64(value: string) {
  return Buffer.from(value, 'base64')
}

function isAuthorizedE2EBootstrap(req: NextRequest) {
  if (process.env.NODE_ENV === 'production') {
    return false
  }

  const configuredSecret =
    process.env.VIPER_E2E_BOOTSTRAP_SECRET?.trim() || 'viper-playwright-bootstrap'
  const providedSecret = req.headers.get('x-viper-e2e-secret')?.trim()

  if (!providedSecret) {
    return false
  }

  const configuredBuffer = Buffer.from(configuredSecret)
  const providedBuffer = Buffer.from(providedSecret)

  return (
    configuredBuffer.length === providedBuffer.length &&
    crypto.timingSafeEqual(configuredBuffer, providedBuffer)
  )
}

async function upsertUser({
  providerUserId,
  email,
  name,
}: {
  providerUserId: string
  email: string | null
  name: string | null
}) {
  return prisma.user.upsert({
    where: {
      provider_user_id: providerUserId,
    },
    update: {
      email,
      name,
      updated_at: new Date(),
    },
    create: {
      provider_user_id: providerUserId,
      email,
      name,
      user_type: 'free',
      created_at: new Date(),
    },
  })
}

async function handleE2EBootstrap(cookieStore: Awaited<ReturnType<typeof cookies>>, body: LoginRequestBody) {
  const userInfo = body.userInfo

  if (!userInfo?.verifierId) {
    return NextResponse.json(
      { error: 'Invalid user info', details: 'verifierId is missing' },
      { status: 400 }
    )
  }

  const user = await upsertUser({
    providerUserId: userInfo.verifierId,
    email: userInfo.email ?? null,
    name: userInfo.name ?? null,
  })

  clearAuthCookies(cookieStore)
  setSessionCookies(cookieStore, {
    userId: user.id.toString(),
    providerUserId: user.provider_user_id,
  })

  return NextResponse.json({ user: serializeUser(user) })
}

async function handleWeb3AuthLogin(cookieStore: Awaited<ReturnType<typeof cookies>>, body: LoginRequestBody) {
  const idToken = body.idToken || body.userInfo?.idToken

  if (!idToken) {
    return NextResponse.json(
      { error: 'Unauthorized', details: 'A verifiable Web3Auth idToken is required.' },
      { status: 401 }
    )
  }

  const verifiedIdentity = await verifyWeb3AuthIdToken(idToken, body.userInfo)
  const user = await upsertUser({
    providerUserId: verifiedIdentity.providerUserId,
    email: verifiedIdentity.email,
    name: verifiedIdentity.name,
  })

  clearAuthCookies(cookieStore)
  setSessionCookies(cookieStore, {
    userId: user.id.toString(),
    providerUserId: user.provider_user_id,
  })

  return NextResponse.json({ user: serializeUser(user) })
}

async function handleCosmosLogin(cookieStore: Awaited<ReturnType<typeof cookies>>, body: LoginRequestBody) {
  const address = body.address?.trim()
  const challengeToken = body.challengeToken?.trim()
  const signature = body.signature

  if (!address || !challengeToken || !signature?.signature || !signature.pub_key?.value) {
    return NextResponse.json(
      { error: 'Unauthorized', details: 'A signed Cosmos login challenge is required.' },
      { status: 401 }
    )
  }

  const challenge = consumeCosmosChallenge(cookieStore, challengeToken, address)

  if (!challenge) {
    return NextResponse.json(
      { error: 'Unauthorized', details: 'The Cosmos login challenge is invalid or expired.' },
      { status: 401 }
    )
  }

  const addressPrefix = getAddressPrefix(address)
  if (!addressPrefix) {
    return NextResponse.json(
      { error: 'Unauthorized', details: 'The Cosmos wallet address is invalid.' },
      { status: 401 }
    )
  }

  const isValidSignature = verifyADR36Amino(
    addressPrefix,
    address,
    challenge.message,
    new Uint8Array(bufferFromBase64(signature.pub_key.value)),
    new Uint8Array(bufferFromBase64(signature.signature))
  )

  if (!isValidSignature) {
    return NextResponse.json(
      { error: 'Unauthorized', details: 'The Cosmos wallet signature could not be verified.' },
      { status: 401 }
    )
  }

  const user = await upsertUser({
    providerUserId: address,
    email: null,
    name: `Cosmos ${address.slice(0, 8)}...${address.slice(-6)}`,
  })

  clearAuthCookies(cookieStore)
  cookieStore.delete(AUTH_CHALLENGE_COOKIE)
  setSessionCookies(cookieStore, {
    userId: user.id.toString(),
    providerUserId: user.provider_user_id,
  })

  return NextResponse.json({ user: serializeUser(user) })
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as LoginRequestBody
    const cookieStore = await cookies()

    if (isAuthorizedE2EBootstrap(req)) {
      return handleE2EBootstrap(cookieStore, body)
    }

    if (body.provider === 'cosmos' || body.challengeToken || body.signature) {
      return handleCosmosLogin(cookieStore, body)
    }

    return handleWeb3AuthLogin(cookieStore, body)
  } catch (error) {
    console.error('❌ [AUTH/LOGIN] Login error:', error)
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    )
  }
}
