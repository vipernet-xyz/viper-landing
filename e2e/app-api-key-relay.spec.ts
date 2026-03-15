import { expect, test } from '@playwright/test'
import { bootstrapSessionFromLogin } from './utils/auth-session'

test.describe.configure({ mode: 'serial' })
test.setTimeout(120_000)

const relayURL = process.env.E2E_DIRECT_RELAY_URL || 'http://127.0.0.1:8000/relay/0002'
const retryableRelayMessage = 'no healthy servicers after refresh'

test('authenticated user can create an app in the UI and use its API key for a live relay request', async ({
  page,
}) => {
  const verifierId = `api-key-relay-${Date.now()}@test.local`
  const appName = `API Key Relay ${Date.now()}`
  let appId: number | null = null

  await bootstrapSessionFromLogin(page, {
    verifierId,
    email: verifierId,
    name: 'API Key Relay User',
  })

  try {
    await page.goto('/dashboard/apps/create', { waitUntil: 'domcontentloaded' })

    await expect(page).toHaveURL(/\/dashboard\/apps\/create$/)
    await expect(page.getByRole('heading', { name: 'Create New App' })).toBeVisible({
      timeout: 15_000,
    })

    await page.getByLabel('App Name *').fill(appName)
    await page.getByLabel('Description (Optional)').fill(
      'Created by the Playwright API key relay flow'
    )
    await page.getByPlaceholder('https://example.com').first().fill('https://api-key-relay.test')
    await page.locator('label[for="chain-2"]').click()
    await page.getByRole('button', { name: 'Create App' }).click()

    await page.waitForURL(/\/dashboard\/apps$/)

    const appRow = page.locator('tr', { hasText: appName }).first()
    await expect(appRow).toBeVisible({ timeout: 15_000 })
    await appRow.click()

    await page.waitForURL(/\/dashboard\/apps\/\d+$/)
    appId = Number(page.url().split('/').pop())

    await expect(page.getByRole('heading', { name: appName })).toBeVisible({ timeout: 20_000 })

    const apiKey = (await page.locator('code').filter({ hasText: /^vpr_/ }).first().textContent())?.trim()
    expect(apiKey).toMatch(/^vpr_[0-9a-f]+$/)

    let relayStatus = 0
    let relayBody: any = null

    for (let attempt = 1; attempt <= 4; attempt += 1) {
      const relayResponse = await page.context().request.post(relayURL, {
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': apiKey!,
        },
        data: {
          jsonrpc: '2.0',
          id: 1,
          method: 'eth_blockNumber',
          params: [],
        },
      })

      relayStatus = relayResponse.status()
      relayBody = await relayResponse.json().catch(async () => relayResponse.text())

      const relayText =
        typeof relayBody === 'string' ? relayBody.toLowerCase() : JSON.stringify(relayBody).toLowerCase()

      if (relayStatus === 200) {
        break
      }

      if (!relayText.includes(retryableRelayMessage) || attempt === 4) {
        break
      }

      await page.waitForTimeout(attempt * 1_500)
    }

    expect(relayStatus).toBe(200)
    expect(relayBody.signature).toBeTruthy()
    expect(relayBody.proof?.blockchain).toBe('0002')

    const rpcBody = JSON.parse(relayBody.response)
    expect(rpcBody.jsonrpc).toBe('2.0')
    expect(rpcBody.result).toMatch(/^0x[0-9a-f]+$/)
  } finally {
    if (appId) {
      await page.context().request.delete(`/api/apps?appId=${appId}`).catch(() => null)
    }

    await page.context().request.post('/api/auth/logout').catch(() => null)
  }
})
