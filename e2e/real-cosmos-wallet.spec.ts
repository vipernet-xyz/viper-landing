import { chromium, expect, test } from '@playwright/test'
import { envFlag, resolveEnvPath, skipMessage } from './utils/real-provider'

test.describe.configure({ mode: 'serial' })
test.setTimeout(120_000)

const baseURL = process.env.PLAYWRIGHT_BASE_URL || 'http://localhost:3020'
const extensionPath = resolveEnvPath('E2E_COSMOS_WALLET_EXTENSION_PATH')
const userDataDir = resolveEnvPath('E2E_COSMOS_WALLET_USER_DATA_DIR')

test('real Cosmos wallet flow restores an authenticated dashboard session', async () => {
  test.skip(
    !envFlag('E2E_REAL_COSMOS_WALLET_ENABLED'),
    'Enable with E2E_REAL_COSMOS_WALLET_ENABLED=1'
  )
  test.skip(
    !extensionPath || !userDataDir,
    skipMessage('Real Cosmos wallet smoke tests', [
      'E2E_COSMOS_WALLET_EXTENSION_PATH',
      'E2E_COSMOS_WALLET_USER_DATA_DIR',
    ]) || 'Missing wallet extension configuration'
  )

  const context = await chromium.launchPersistentContext(userDataDir!, {
    headless: false,
    viewport: { width: 1440, height: 960 },
    args: [
      `--disable-extensions-except=${extensionPath}`,
      `--load-extension=${extensionPath}`,
    ],
  })

  try {
    const page = context.pages()[0] || await context.newPage()
    await page.goto(new URL('/dashboard', baseURL).toString(), { waitUntil: 'domcontentloaded' })

    const readSession = async () =>
      page.evaluate(async () => {
        const res = await fetch('/api/auth/me', { credentials: 'include' })
        if (!res.ok) {
          return {
            ok: false,
            status: res.status,
          }
        }

        const data = await res.json()
        return {
          ok: true,
          status: res.status,
          user: data.user ?? null,
        }
      })

    let session = await readSession()
    if (!session.ok || !session.user) {
      await page.goto(new URL('/login', baseURL).toString(), { waitUntil: 'domcontentloaded' })

      const cosmosButton = page.getByRole('button', { name: /Cosmos Wallet/i }).first()
      await expect(cosmosButton).toBeVisible({ timeout: 15_000 })

      const extensionPagePromise = context.waitForEvent('page', { timeout: 20_000 }).catch(() => null)

      await cosmosButton.click()

      const extensionPage = await extensionPagePromise
      if (extensionPage) {
        await extensionPage.waitForLoadState('domcontentloaded').catch(() => null)
      }

      await expect
        .poll(
          () => context.pages().map((entry) => entry.url()).join('\n'),
          { timeout: 20_000 }
        )
        .toMatch(/chrome-extension:\/\//i)

      await page.goto(new URL('/dashboard', baseURL).toString(), { waitUntil: 'domcontentloaded' })
      await expect
        .poll(readSession, { timeout: 30_000 })
        .toMatchObject({
          ok: true,
          status: 200,
        })
    }

    await expect
      .poll(readSession, { timeout: 30_000 })
      .toMatchObject({
        ok: true,
        status: 200,
      })

    session = await readSession()
    expect(session.ok).toBe(true)
    expect(session.user?.verifierId).toMatch(/^cosmos1[0-9a-z]{10,}$/)

    const expectedAddress = process.env.E2E_COSMOS_EXPECTED_ADDRESS?.trim()
    if (expectedAddress) {
      expect(session.user?.verifierId).toBe(expectedAddress)
    }

    await expect(page).toHaveURL(/\/dashboard(?:\/)?$/, { timeout: 30_000 })

    const pageText = ((await page.textContent('body')) || '').replace(/\s+/g, ' ')
    expect(pageText).toContain('Hi There!')
    expect(pageText).toContain('Dashboard')
    expect(pageText).not.toContain('You are not logged in')
  } finally {
    await context.close()
  }
})
