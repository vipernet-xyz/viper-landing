import { NextRequest, NextResponse } from 'next/server'

const GO_BACKEND_URL = process.env.GO_BACKEND_URL || 'http://localhost:8000'

async function relayToBackend(backendUrl: string, apiKey: string, body: unknown) {
  const response = await fetch(backendUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
    },
    body: JSON.stringify(body),
  })

  let data: unknown = null

  try {
    data = await response.json()
  } catch (error) {
    console.error('[Relay Proxy] Failed to decode backend response:', { backendUrl, error })
  }

  return { response, data }
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ chainId: string }> }
) {
  try {
    const { chainId } = await params
    const apiKey = req.headers.get('x-api-key') || req.headers.get('authorization')?.replace('Bearer ', '')

    if (!apiKey) {
      return NextResponse.json(
        { error: 'Missing API key. Include x-api-key header or Authorization: Bearer vpr_...' },
        { status: 401 }
      )
    }

    // Get request body
    const body = await req.json()

    console.log('[Relay Proxy] Request:', { chainId, body })

    const primaryBackendUrl = `${GO_BACKEND_URL}/relay/${chainId}`
    let { response, data } = await relayToBackend(primaryBackendUrl, apiKey, body)

    if (response.status === 404) {
      const compatibilityBackendUrl = `${GO_BACKEND_URL}/api/relay/${chainId}`
      console.warn('[Relay Proxy] Primary relay endpoint missing, retrying compatibility path:', {
        primaryBackendUrl,
        compatibilityBackendUrl,
      })
      ;({ response, data } = await relayToBackend(compatibilityBackendUrl, apiKey, body))
    }

    console.log('[Relay Proxy] Response:', { status: response.status, data })

    if (!response.ok) {
      console.error('[Relay Proxy] Error response:', data)
      return NextResponse.json(data, { status: response.status })
    }

    return NextResponse.json(data, { status: 200 })
  } catch (error) {
    console.error('Relay proxy error:', error)
    return NextResponse.json(
      { error: 'Failed to process relay request' },
      { status: 500 }
    )
  }
}
