import crypto from 'crypto'

export const AUTH_SESSION_COOKIE = 'viper_session'
export const LEGACY_USER_ID_COOKIE = 'viper_user_id'
export const AUTH_WALLET_COOKIE = 'viper_wallet'
export const AUTH_CHALLENGE_COOKIE = 'viper_auth_challenge'

const SESSION_DURATION_SECONDS = 60 * 60 * 24 * 7
const CHALLENGE_DURATION_SECONDS = 60 * 5

type CookieStore = {
  get(name: string): { value: string } | undefined
  set(name: string, value: string, options?: Record<string, unknown>): void
  delete(name: string): void
}

type SessionTokenPayload = {
  type: 'session'
  userId: string
  providerUserId: string
  issuedAt: number
  expiresAt: number
}

type CosmosChallengePayload = {
  type: 'cosmos_challenge'
  address: string
  message: string
  nonce: string
  issuedAt: number
  expiresAt: number
}

function getAuthSecret() {
  const secret = process.env.VIPER_AUTH_SECRET?.trim()

  if (!secret) {
    throw new Error('VIPER_AUTH_SECRET is required for authenticated sessions.')
  }

  return secret
}

function getCookieOptions(maxAge: number, httpOnly = true) {
  return {
    httpOnly,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax' as const,
    path: '/',
    maxAge,
  }
}

function encodeBase64Url(value: string | Buffer) {
  return Buffer.from(value)
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/g, '')
}

function decodeBase64Url(value: string) {
  const normalized = value.replace(/-/g, '+').replace(/_/g, '/')
  const padding = normalized.length % 4 === 0 ? '' : '='.repeat(4 - (normalized.length % 4))
  return Buffer.from(`${normalized}${padding}`, 'base64')
}

function signToken(unsignedToken: string) {
  return encodeBase64Url(
    crypto.createHmac('sha256', getAuthSecret()).update(unsignedToken).digest()
  )
}

function createSignedToken<T extends SessionTokenPayload | CosmosChallengePayload>(payload: T) {
  const encodedPayload = encodeBase64Url(JSON.stringify(payload))
  const signature = signToken(encodedPayload)
  return `${encodedPayload}.${signature}`
}

function verifySignedToken<T extends SessionTokenPayload | CosmosChallengePayload>(
  token: string,
  expectedType: T['type']
) {
  const [encodedPayload, providedSignature] = token.split('.')

  if (!encodedPayload || !providedSignature) {
    return null
  }

  const expectedSignature = signToken(encodedPayload)
  const expectedBuffer = Buffer.from(expectedSignature)
  const providedBuffer = Buffer.from(providedSignature)

  if (
    expectedBuffer.length !== providedBuffer.length ||
    !crypto.timingSafeEqual(expectedBuffer, providedBuffer)
  ) {
    return null
  }

  try {
    const payload = JSON.parse(decodeBase64Url(encodedPayload).toString('utf8')) as T
    const now = Math.floor(Date.now() / 1000)

    if (payload.type !== expectedType || payload.expiresAt <= now) {
      return null
    }

    return payload
  } catch {
    return null
  }
}

export function clearAuthCookies(cookieStore: CookieStore) {
  cookieStore.delete(AUTH_SESSION_COOKIE)
  cookieStore.delete(LEGACY_USER_ID_COOKIE)
  cookieStore.delete(AUTH_WALLET_COOKIE)
  cookieStore.delete(AUTH_CHALLENGE_COOKIE)
}

export function setSessionCookies(
  cookieStore: CookieStore,
  {
    userId,
    providerUserId,
  }: {
    userId: string
    providerUserId: string
  }
) {
  const issuedAt = Math.floor(Date.now() / 1000)
  const expiresAt = issuedAt + SESSION_DURATION_SECONDS
  const token = createSignedToken<SessionTokenPayload>({
    type: 'session',
    userId,
    providerUserId,
    issuedAt,
    expiresAt,
  })

  cookieStore.set(
    AUTH_SESSION_COOKIE,
    token,
    getCookieOptions(SESSION_DURATION_SECONDS, true)
  )
  cookieStore.set(
    AUTH_WALLET_COOKIE,
    providerUserId,
    getCookieOptions(SESSION_DURATION_SECONDS, false)
  )
  cookieStore.delete(LEGACY_USER_ID_COOKIE)
}

export function readVerifiedSession(cookieStore: CookieStore) {
  const sessionCookie = cookieStore.get(AUTH_SESSION_COOKIE)?.value

  if (!sessionCookie) {
    if (cookieStore.get(LEGACY_USER_ID_COOKIE)?.value) {
      clearAuthCookies(cookieStore)
    }
    return null
  }

  const payload = verifySignedToken<SessionTokenPayload>(sessionCookie, 'session')

  if (!payload) {
    clearAuthCookies(cookieStore)
    return null
  }

  const userId = Number.parseInt(payload.userId, 10)

  if (!Number.isInteger(userId) || userId <= 0) {
    clearAuthCookies(cookieStore)
    return null
  }

  return {
    userId,
    providerUserId: payload.providerUserId,
  }
}

export function issueCosmosChallenge(cookieStore: CookieStore, address: string) {
  const issuedAt = Math.floor(Date.now() / 1000)
  const expiresAt = issuedAt + CHALLENGE_DURATION_SECONDS
  const nonce = crypto.randomBytes(16).toString('hex')
  const message = [
    'Sign in to Viper Network',
    `Address: ${address}`,
    `Nonce: ${nonce}`,
    `Issued At: ${new Date(issuedAt * 1000).toISOString()}`,
    `Expires At: ${new Date(expiresAt * 1000).toISOString()}`,
  ].join('\n')

  const token = createSignedToken<CosmosChallengePayload>({
    type: 'cosmos_challenge',
    address,
    message,
    nonce,
    issuedAt,
    expiresAt,
  })

  cookieStore.set(tokenCookieName(), token, getCookieOptions(CHALLENGE_DURATION_SECONDS, true))

  return {
    challengeToken: token,
    message,
    expiresAt,
  }
}

function tokenCookieName() {
  return AUTH_CHALLENGE_COOKIE
}

export function consumeCosmosChallenge(
  cookieStore: CookieStore,
  challengeToken: string,
  address: string
) {
  const storedChallenge = cookieStore.get(tokenCookieName())?.value
  cookieStore.delete(tokenCookieName())

  if (!storedChallenge || storedChallenge !== challengeToken) {
    return null
  }

  const payload = verifySignedToken<CosmosChallengePayload>(challengeToken, 'cosmos_challenge')

  if (!payload || payload.address !== address) {
    return null
  }

  return payload
}
