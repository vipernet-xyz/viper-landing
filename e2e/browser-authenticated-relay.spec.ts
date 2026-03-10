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

  await bootstrapSessionFromLogin(page, {
    verifierId: 'relay_spammer_user',
    email: 'spammer@vipernet.xyz',
    name: 'Relay Spammer User',
  })

  await page.goto('/dashboard/test-relay', { waitUntil: 'domcontentloaded' })
  await expect(page.getByRole('heading', { name: 'Test Relay Endpoint' })).toBeVisible()

  await selectAppOption(page, 'Relay Spammer App')
  await page.getByPlaceholder('0002').fill('0001')
  await page.getByRole('button', { name: 'Send Relay Request' }).click()

  await expect(page.getByText('✓ Success')).toBeVisible({ timeout: 20_000 })
  await expect(page.locator('pre').first()).toContainText('"response"')
  await expect(page.locator('pre').first()).toContainText('"strategyUsed": "free_user_portal"')
})
