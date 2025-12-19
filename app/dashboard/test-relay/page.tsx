'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { useQuery } from '@tanstack/react-query'

const EXAMPLE_REQUESTS = {
  eth_blockNumber: {
    method: 'eth_blockNumber',
    params: [],
    id: 1,
    jsonrpc: '2.0'
  },
  eth_gasPrice: {
    method: 'eth_gasPrice',
    params: [],
    id: 1,
    jsonrpc: '2.0'
  },
  eth_chainId: {
    method: 'eth_chainId',
    params: [],
    id: 1,
    jsonrpc: '2.0'
  }
}

export default function TestRelayPage() {
  const [chainId, setChainId] = useState('0002')
  const [apiKey, setApiKey] = useState('')
  const [requestBody, setRequestBody] = useState(JSON.stringify(EXAMPLE_REQUESTS.eth_blockNumber, null, 2))
  const [response, setResponse] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Fetch user's apps to get API key
  const { data: apps } = useQuery({
    queryKey: ['apps'],
    queryFn: async () => {
      const res = await fetch('/api/apps')
      if (!res.ok) throw new Error('Failed to fetch apps')
      return res.json()
    }
  })

  const handleSendRelay = async () => {
    setLoading(true)
    setError(null)
    setResponse(null)

    try {
      // Validate JSON parsing
      let parsedBody
      try {
        parsedBody = JSON.parse(requestBody)
      } catch (parseErr) {
        setError('Invalid JSON format. Please check your request body.')
        setLoading(false)
        return
      }

      // Validate required JSON-RPC fields
      if (!parsedBody.jsonrpc || !parsedBody.method || !parsedBody.id) {
        setError('Missing required JSON-RPC fields: jsonrpc, method, id')
        setLoading(false)
        return
      }

      console.log('Sending request:', { chainId, apiKey: apiKey.substring(0, 20) + '...', body: parsedBody })

      const res = await fetch(`/api/relay/${chainId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': apiKey
        },
        body: JSON.stringify(parsedBody)
      })

      const data = await res.json()
      console.log('Response:', { status: res.status, data })

      if (!res.ok) {
        // Show the full error response
        setError(typeof data === 'string' ? data : JSON.stringify(data, null, 2))
      } else {
        setResponse(data)
      }
    } catch (err: any) {
      console.error('Request error:', err)
      setError(err.message || 'Failed to send relay request')
    } finally {
      setLoading(false)
    }
  }

  const loadExample = (example: keyof typeof EXAMPLE_REQUESTS) => {
    setRequestBody(JSON.stringify(EXAMPLE_REQUESTS[example], null, 2))
  }

  return (
    <div className="container mx-auto p-6 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Test Relay Endpoint</h1>
        <p className="text-gray-400">Send test requests to the Viper Network relay</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Request Configuration */}
        <Card className="bg-[#0A0A0A] border-white/10">
          <CardHeader>
            <CardTitle className="text-white">Request Configuration</CardTitle>
            <CardDescription className="text-gray-400">
              Configure your relay request parameters
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* API Key Selection */}
            <div className="space-y-2">
              <Label className="text-white">API Key</Label>
              {apps && apps.length > 0 ? (
                <select
                  className="w-full bg-white/5 border border-white/10 rounded-md px-3 py-2 text-white"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                >
                  <option value="">Select an API key</option>
                  {apps.map((app: any) => (
                    <option key={app.id} value={app.api_key}>
                      {app.name} - {app.api_key.substring(0, 20)}...
                    </option>
                  ))}
                </select>
              ) : (
                <Input
                  placeholder="vpr_..."
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  className="bg-white/5 border-white/10 text-white"
                />
              )}
            </div>

            {/* Chain ID */}
            <div className="space-y-2">
              <Label className="text-white">Chain ID</Label>
              <Input
                placeholder="0002"
                value={chainId}
                onChange={(e) => setChainId(e.target.value)}
                className="bg-white/5 border-white/10 text-white"
              />
              <p className="text-xs text-gray-500">
                Common chains: 0002 (Ethereum), 0001 (Polygon), etc.
              </p>
            </div>

            {/* Example Requests */}
            <div className="space-y-2">
              <Label className="text-white">Example Requests</Label>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => loadExample('eth_blockNumber')}
                  className="text-xs"
                >
                  Block Number
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => loadExample('eth_gasPrice')}
                  className="text-xs"
                >
                  Gas Price
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => loadExample('eth_chainId')}
                  className="text-xs"
                >
                  Chain ID
                </Button>
              </div>
            </div>

            {/* Request Body */}
            <div className="space-y-2">
              <Label className="text-white">Request Body (JSON-RPC)</Label>
              <Textarea
                placeholder='{"method":"eth_blockNumber","params":[],"id":1,"jsonrpc":"2.0"}'
                value={requestBody}
                onChange={(e) => setRequestBody(e.target.value)}
                className="bg-white/5 border-white/10 text-white font-mono text-sm min-h-[200px]"
              />
            </div>

            {/* Send Button */}
            <Button
              onClick={handleSendRelay}
              disabled={loading || !apiKey || !chainId}
              className="w-full bg-purple-600 hover:bg-purple-700"
            >
              {loading ? 'Sending...' : 'Send Relay Request'}
            </Button>
          </CardContent>
        </Card>

        {/* Response */}
        <Card className="bg-[#0A0A0A] border-white/10">
          <CardHeader>
            <CardTitle className="text-white">Response</CardTitle>
            <CardDescription className="text-gray-400">
              Relay response from Viper Network
            </CardDescription>
          </CardHeader>
          <CardContent>
            {error && (
              <div className="bg-red-500/10 border border-red-500/20 rounded-md p-4 mb-4">
                <p className="text-red-400 text-sm font-mono">{error}</p>
              </div>
            )}

            {response && (
              <div className="space-y-4">
                <div className="bg-green-500/10 border border-green-500/20 rounded-md p-4">
                  <p className="text-green-400 text-sm font-semibold mb-2">✓ Success</p>
                  <pre className="text-white text-xs font-mono overflow-x-auto">
                    {JSON.stringify(response, null, 2)}
                  </pre>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="bg-white/5 rounded-md p-3">
                    <p className="text-gray-400 text-xs mb-1">Response Time</p>
                    <p className="text-white font-semibold">
                      {response.relay?.response_time_ms || 'N/A'}ms
                    </p>
                  </div>
                  <div className="bg-white/5 rounded-md p-3">
                    <p className="text-gray-400 text-xs mb-1">Servicer</p>
                    <p className="text-white font-mono text-xs truncate">
                      {response.relay?.servicer_address?.substring(0, 20) || 'N/A'}...
                    </p>
                  </div>
                </div>
              </div>
            )}

            {!error && !response && (
              <div className="text-center py-12">
                <p className="text-gray-500">Send a request to see the response</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Info Card */}
      <Card className="mt-6 bg-[#0A0A0A] border-white/10">
        <CardHeader>
          <CardTitle className="text-white">How It Works</CardTitle>
        </CardHeader>
        <CardContent className="text-gray-400 space-y-2 text-sm">
          <p>
            1. <strong className="text-white">Select your API key</strong> from your apps or enter it manually
          </p>
          <p>
            2. <strong className="text-white">Choose a chain ID</strong> (e.g., 0002 for Ethereum)
          </p>
          <p>
            3. <strong className="text-white">Enter a JSON-RPC request</strong> or use an example
          </p>
          <p>
            4. <strong className="text-white">Send the request</strong> and see the response from Viper Network
          </p>
          <p className="pt-2 border-t border-white/10 mt-4">
            The relay request is forwarded to the Go backend at{' '}
            <code className="text-purple-400">http://localhost:8000/relay/:chainId</code>, which processes it and logs it to Supabase.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
