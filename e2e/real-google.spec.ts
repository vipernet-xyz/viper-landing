import { expect, test } from '@playwright/test'
import { envFlag } from './utils/real-provider'

test.describe.configure({ mode: 'serial' })
test.setTimeout(90_000)

const PROVIDER_URL_PATTERN = /auth\.web3auth\.io|accounts\.google\.com/i

test.describe('provider launch', () => {
  test.use({ storageState: { cookies: [], origins: [] } })

  test('real Google / Web3Auth login launches the external provider flow', async ({ page }) => {
    test.skip(!envFlag('E2E_REAL_GOOGLE_ENABLED'), 'Enable with E2E_REAL_GOOGLE_ENABLED=1')

    await page.goto('/login', { waitUntil: 'domcontentloaded' })

    const loginButton = page.getByRole('button', { name: /Continue with Google/i }).first()
    await expect(loginButton).toBeVisible({ timeout: 15_000 })

    const popupPromise = page.context().waitForEvent('page', { timeout: 20_000 }).catch(() => null)

    await loginButton.click()

    await expect(page.getByText('Your Web3Auth wallet with one click')).toBeVisible({ timeout: 15_000 })

    const providerButton = page.getByRole('button', { name: /Continue with Google/i }).last()
    await expect(providerButton).toBeVisible({ timeout: 15_000 })
    await providerButton.click()

    const popup = await popupPromise
    if (popup) {
      await popup.waitForLoadState('domcontentloaded').catch(() => null)
      await expect.poll(() => popup.url(), { timeout: 20_000 }).toMatch(PROVIDER_URL_PATTERN)
      await popup.close().catch(() => null)
      return
    }

    await expect.poll(() => page.url(), { timeout: 20_000 }).toMatch(PROVIDER_URL_PATTERN)
  })
})

test('stored real Google auth state hydrates an authenticated dashboard session', async ({ page }) => {
  test.skip(!envFlag('E2E_REAL_GOOGLE_ENABLED'), 'Enable with E2E_REAL_GOOGLE_ENABLED=1')
  test.skip(
    !process.env.E2E_REAL_GOOGLE_STORAGE_STATE,
    'Provide E2E_REAL_GOOGLE_STORAGE_STATE with a storageState captured from a real Google login'
  )

  await page.goto('/dashboard', { waitUntil: 'domcontentloaded' })

  await expect(page).not.toHaveURL(/\/login/)
  await expect(page.getByText('Your Overview')).toBeVisible({ timeout: 20_000 })

  const me = await page.context().request.get('/api/auth/me')
  expect(me.status()).toBe(200)

  const body = await me.json()
  expect(body?.user?.id).toBeTruthy()
})
