import { expect, test, type Page } from '@playwright/test'
import { bootstrapSessionFromLogin } from './utils/auth-session'

test.setTimeout(120_000)
test('browser session hydrates, creates an app, deletes the app, and logs out', async ({ page }) => {
  const verifierId = `browser-flow-${Date.now()}@test.local`
  const appName = `Browser E2E ${Date.now()}`
  let appId: number | null = null

  await bootstrapSessionFromLogin(page, {
    verifierId,
    email: verifierId,
    name: 'Relay Spammer User',
  })

  try {
    await page.goto('/dashboard/apps/create', { waitUntil: 'domcontentloaded' })

    await expect(page).toHaveURL(/\/dashboard\/apps\/create$/)
    await expect(page.getByRole('heading', { name: 'Create New App' })).toBeVisible({
      timeout: 15_000,
    })
    await expect(page.getByLabel('App Name *')).toBeVisible({ timeout: 15_000 })

    await page.getByLabel('App Name *').fill(appName)
    await page.getByLabel('Description (Optional)').fill('Created by the browser-authenticated Playwright suite')
    await page.getByPlaceholder('https://example.com').first().fill('https://browser-e2e.test')
    await page.locator('label[for="chain-1"]').click()
    await page.getByRole('button', { name: 'Create App' }).click()

    await page.waitForURL(/\/dashboard\/apps$/)
    const appRow = page.locator('tr', { hasText: appName }).first()
    await expect(appRow).toBeVisible({ timeout: 15_000 })
    await appRow.click()

    await page.waitForURL(/\/dashboard\/apps\/\d+$/)
    appId = Number(page.url().split('/').pop())

    await expect(page.getByRole('heading', { name: appName })).toBeVisible({ timeout: 20_000 })
    const apiKeyCode = page.locator('code').filter({ hasText: /^vpr_/ }).first()
    await expect(apiKeyCode).toBeVisible()
    await expect(page.getByRole('tab', { name: 'Endpoints' })).toBeVisible()
    await expect(page.getByRole('tab', { name: 'Analytics' })).toBeVisible()
    await expect(page.getByRole('heading', { name: 'Connect Your App' })).toBeVisible()
    await expect(page.getByText('Network URL')).toBeVisible()
    await expect(page.getByText('cURL example')).toBeVisible()
    await expect(page.getByText('x-api-key', { exact: true }).first()).toBeVisible()
    await expect(page.getByText('http://node2.vipernet.xyz:8000/relay/0001', { exact: true })).toBeVisible()

    await page.goto(`/dashboard/apps/${appId}`, { waitUntil: 'domcontentloaded' })
    await expect(page.getByRole('heading', { name: appName })).toBeVisible({ timeout: 20_000 })

    await page.getByRole('button', { name: /Delete/i }).click()
    await expect(page.getByRole('heading', { name: 'Delete App' })).toBeVisible()
    await page.getByRole('button', { name: /^Delete App$/ }).click()

    await page.waitForURL(/\/dashboard\/apps$/)
    await expect(page.locator('tr', { hasText: appName })).toHaveCount(0)
    appId = null

    await page.getByRole('button', { name: 'Logout' }).evaluate((button) => button.click())
    await expect(page).toHaveURL(/\/login$/, { timeout: 15_000 })
    await expect(page.getByText('Please login to continue')).toBeVisible()
  } finally {
    if (appId) {
      await page.context().request.delete(`/api/apps?appId=${appId}`).catch(() => null)
    }

    await page.context().request.post('/api/auth/logout').catch(() => null)
  }
})
