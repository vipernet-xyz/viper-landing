import * as jose from 'jose'

const WEB3AUTH_JWKS_URL = 'https://api-auth.web3auth.io/jwks'

const jwks = jose.createRemoteJWKSet(new URL(WEB3AUTH_JWKS_URL))

type Web3AuthUserInfo = {
  email?: string
  name?: string
  verifierId?: string
}

function assertWeb3AuthUserInfoMatchesClaims(
  claims: jose.JWTPayload,
  userInfo?: Web3AuthUserInfo
) {
  if (!userInfo) {
    return
  }

  const expectedVerifierCandidates = [
    typeof claims.email === 'string' ? claims.email : undefined,
    typeof claims.sub === 'string' ? claims.sub : undefined,
  ]
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
    typeof claims.email === 'string' &&
    userInfo.email.toLowerCase() !== claims.email.toLowerCase()
  ) {
    throw new Error('Web3Auth email does not match the verified token claims.')
  }
}

export async function verifyWeb3AuthIdToken(
  idToken: string,
  userInfo?: Web3AuthUserInfo
) {
  const expectedAudience = process.env.NEXT_PUBLIC_WEB3AUTH_CLIENT_ID?.trim()

  if (!expectedAudience) {
    throw new Error('NEXT_PUBLIC_WEB3AUTH_CLIENT_ID is required for Web3Auth token verification.')
  }

  let payload: jose.JWTPayload

  try {
    const result = await jose.jwtVerify(idToken, jwks, {
      algorithms: ['ES256', 'RS256'],
      audience: expectedAudience,
    })
    payload = result.payload
  } catch (error) {
    if (error instanceof jose.errors.JWKSNoMatchingKey) {
      throw new Error('No matching Web3Auth signing key was found.')
    }
    if (error instanceof jose.errors.JWTExpired) {
      throw new Error('Expired Web3Auth token.')
    }
    if (error instanceof jose.errors.JWTClaimValidationFailed) {
      throw new Error('Web3Auth token audience mismatch.')
    }
    if (error instanceof Error && error.message.includes('fetch')) {
      throw new Error(`Failed to fetch Web3Auth JWKS: ${error.message}`)
    }
    throw new Error(
      error instanceof Error ? error.message : 'Unable to verify the Web3Auth ID token.'
    )
  }

  if (payload.email_verified === false) {
    throw new Error('Web3Auth token email is not verified.')
  }

  assertWeb3AuthUserInfoMatchesClaims(payload, userInfo)

  const email = typeof payload.email === 'string' ? payload.email.toLowerCase() : null
  const name = typeof payload.name === 'string' ? payload.name : userInfo?.name || null
  const providerUserId =
    email || (typeof payload.sub === 'string' && payload.sub.length > 0 ? payload.sub : null)

  if (!providerUserId) {
    throw new Error('Web3Auth token is missing a stable user identifier.')
  }

  return {
    providerUserId,
    email,
    name,
    claims: payload,
  }
}
