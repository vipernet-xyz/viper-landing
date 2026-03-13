import crypto from 'crypto'

const WEB3AUTH_JWKS_URL = 'https://api-auth.web3auth.io/jwks'
const JWKS_CACHE_TTL_MS = 60 * 60 * 1000

type JsonWebKeyWithKid = JsonWebKey & {
  kid?: string
  alg?: string
  use?: string
}

type Web3AuthJwtClaims = {
  aud?: string | string[]
  email?: string
  email_verified?: boolean
  exp?: number
  iat?: number
  iss?: string
  name?: string
  nbf?: number
  sub?: string
  [key: string]: unknown
}

type Web3AuthUserInfo = {
  email?: string
  name?: string
  verifierId?: string
}

let cachedJwks:
  | {
      expiresAt: number
      keysByKid: Map<string, JsonWebKeyWithKid>
    }
  | undefined

function decodeBase64Url(value: string) {
  const normalized = value.replace(/-/g, '+').replace(/_/g, '/')
  const padding = normalized.length % 4 === 0 ? '' : '='.repeat(4 - (normalized.length % 4))
  return Buffer.from(`${normalized}${padding}`, 'base64')
}

function decodeJwtPart<T>(value: string) {
  return JSON.parse(decodeBase64Url(value).toString('utf8')) as T
}

async function getJwks() {
  const now = Date.now()

  if (cachedJwks && cachedJwks.expiresAt > now) {
    return cachedJwks.keysByKid
  }

  const response = await fetch(WEB3AUTH_JWKS_URL, {
    cache: 'no-store',
  })

  if (!response.ok) {
    throw new Error(`Failed to fetch Web3Auth JWKS: ${response.status}`)
  }

  const body = (await response.json()) as { keys?: JsonWebKeyWithKid[] }
  const keysByKid = new Map<string, JsonWebKeyWithKid>()

  for (const key of body.keys ?? []) {
    if (key.kid) {
      keysByKid.set(key.kid, key)
    }
  }

  cachedJwks = {
    expiresAt: now + JWKS_CACHE_TTL_MS,
    keysByKid,
  }

  return keysByKid
}

function validateAudience(aud: string | string[] | undefined) {
  const expectedAudience = process.env.NEXT_PUBLIC_WEB3AUTH_CLIENT_ID?.trim()

  if (!expectedAudience) {
    throw new Error('NEXT_PUBLIC_WEB3AUTH_CLIENT_ID is required for Web3Auth token verification.')
  }

  if (typeof aud === 'string') {
    return aud === expectedAudience
  }

  if (Array.isArray(aud)) {
    return aud.includes(expectedAudience)
  }

  return false
}

function assertWeb3AuthUserInfoMatchesClaims(
  claims: Web3AuthJwtClaims,
  userInfo?: Web3AuthUserInfo
) {
  if (!userInfo) {
    return
  }

  const expectedVerifierCandidates = [claims.email, claims.sub]
    .filter((value): value is string => typeof value === 'string' && value.length > 0)
    .map((value) => value.toLowerCase())

  if (
    userInfo.verifierId &&
    expectedVerifierCandidates.length > 0 &&
    !expectedVerifierCandidates.includes(userInfo.verifierId.toLowerCase())
  ) {
    throw new Error('Web3Auth verifierId does not match the verified token claims.')
  }

  if (
    userInfo.email &&
    claims.email &&
    userInfo.email.toLowerCase() !== claims.email.toLowerCase()
  ) {
    throw new Error('Web3Auth email does not match the verified token claims.')
  }
}

export async function verifyWeb3AuthIdToken(
  idToken: string,
  userInfo?: Web3AuthUserInfo
) {
  const [encodedHeader, encodedPayload, encodedSignature] = idToken.split('.')

  if (!encodedHeader || !encodedPayload || !encodedSignature) {
    throw new Error('Invalid Web3Auth ID token.')
  }

  const header = decodeJwtPart<{ alg?: string; kid?: string }>(encodedHeader)
  const claims = decodeJwtPart<Web3AuthJwtClaims>(encodedPayload)

  const SUPPORTED_ALGS: Record<string, string> = {
    RS256: 'RSA-SHA256',
    ES256: 'SHA256',
  }

  const verifyAlgorithm = header.alg ? SUPPORTED_ALGS[header.alg] : undefined

  if (!verifyAlgorithm || !header.kid) {
    throw new Error('Unsupported Web3Auth token header.')
  }

  const keysByKid = await getJwks()
  const jwk = keysByKid.get(header.kid)

  if (!jwk) {
    throw new Error('No matching Web3Auth signing key was found.')
  }

  const publicKey = crypto.createPublicKey({
    key: jwk,
    format: 'jwk',
  })

  const verifier = crypto.createVerify(verifyAlgorithm)
  verifier.update(`${encodedHeader}.${encodedPayload}`)
  verifier.end()

  const isValidSignature = verifier.verify(
    publicKey,
    decodeBase64Url(encodedSignature)
  )

  if (!isValidSignature) {
    throw new Error('Invalid Web3Auth token signature.')
  }

  const now = Math.floor(Date.now() / 1000)

  if (typeof claims.exp !== 'number' || claims.exp <= now) {
    throw new Error('Expired Web3Auth token.')
  }

  if (typeof claims.nbf === 'number' && claims.nbf > now) {
    throw new Error('Web3Auth token is not valid yet.')
  }

  if (!validateAudience(claims.aud)) {
    throw new Error('Web3Auth token audience mismatch.')
  }

  if (claims.email_verified === false) {
    throw new Error('Web3Auth token email is not verified.')
  }

  assertWeb3AuthUserInfoMatchesClaims(claims, userInfo)

  const email = typeof claims.email === 'string' ? claims.email.toLowerCase() : null
  const name = typeof claims.name === 'string' ? claims.name : userInfo?.name || null
  const providerUserId =
    email || (typeof claims.sub === 'string' && claims.sub.length > 0 ? claims.sub : null)

  if (!providerUserId) {
    throw new Error('Web3Auth token is missing a stable user identifier.')
  }

  return {
    providerUserId,
    email,
    name,
    claims,
  }
}
