import { expect, test, type Page } from '@playwright/test'
import { bootstrapSessionFromLogin } from './utils/auth-session'

test.describe.configure({ mode: 'serial' })
test.setTimeout(120_000)

const relayHealthcheckURL = process.env.E2E_RELAY_HEALTHCHECK_URL || 'http://localhost:8000/health'

async function selectAppOption(page: Page, appName: string) {
  const select = page.locator('select').first()

  await select.evaluate((element, targetAppName) => {
    const input = element as HTMLSelectElement
    const option = Array.from(input.options).find((entry) =>
      entry.text.includes(targetAppName as string)
    )

    if (!option) {
      throw new Error(`Unable to find API key option for ${targetAppName as string}`)
    }

    input.value = option.value
    input.dispatchEvent(new Event('change', { bubbles: true }))
  }, appName)
}

test('browser session can send a relay request from the dashboard UI', async ({ page }) => {
  const healthcheck = await page.request.get(relayHealthcheckURL).catch(() => null)
  test.skip(!healthcheck || !healthcheck.ok(), `Relay backend unavailable at ${relayHealthcheckURL}`)
  const verifierId = `relay-ui-${Date.now()}@test.local`
  const appName = `Relay UI ${Date.now()}`
  let appId: number | null = null

  await bootstrapSessionFromLogin(page, {
    verifierId,
    email: verifierId,
    name: 'Relay Spammer User',
  })

  try {
    const createAppResponse = await page.context().request.post('/api/apps', {
      data: {
        name: appName,
        description: 'Created by the browser relay Playwright suite',
        allowedOrigins: ['https://relay-ui.test'],
        allowedChains: ['0002'],
        rateLimit: 5000,
      },
    })

    expect(createAppResponse.status()).toBe(201)
    const createdApp = await createAppResponse.json()
    appId = createdApp.id

    await page.goto('/dashboard/test-relay', { waitUntil: 'domcontentloaded' })
    await expect(page.getByRole('heading', { name: 'Test Relay Endpoint' })).toBeVisible()

    await selectAppOption(page, appName)
    await page.getByPlaceholder('0002').fill('0002')
    await page.getByRole('button', { name: 'Send Relay Request' }).click()

    await expect(page.getByText('✓ Success')).toBeVisible({ timeout: 45_000 })
    await expect(page.locator('pre').first()).toContainText('"response"')
    await expect(page.locator('pre').first()).toContainText('"strategyUsed": "free_user_portal"')
  } finally {
    if (appId) {
      await page.context().request.delete(`/api/apps?appId=${appId}`).catch(() => null)
    }
  }
})
