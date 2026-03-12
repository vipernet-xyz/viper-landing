import { expect, test } from '@playwright/test'
import { ConsoleMonitor } from './utils/console-monitor'

test.describe.configure({ mode: 'serial' })

function unexpectedMessages(monitor: ConsoleMonitor) {
  const analysis = monitor.analyze()
  return analysis.allErrors.filter((entry) => {
    const text = entry.text.toLowerCase()
    const location = (entry.location || '').toLowerCase()
    return !text.includes('favicon') &&
      !(location.includes('/api/auth/me') && text.includes('401'))
  })
}

test('landing page exposes app entry points without console errors', async ({ page }) => {
  const monitor = new ConsoleMonitor(page)
  const heroCopy = page.getByText('The Trustless Gateway to Web3.')
  const featuresCopy = page.getByText("Point your app to Viper's RPC endpoint.").first()
  const launchAppLink = page.getByRole('link', { name: 'Launch App' }).first()
  const dashboardLink = page.getByRole('link', { name: 'Dashboard' }).first()

  await page.goto('/', { waitUntil: 'domcontentloaded' })
  await expect(heroCopy).toBeVisible({ timeout: 20_000 })
  await expect(featuresCopy).toBeVisible({ timeout: 20_000 })

  await expect(launchAppLink).toBeVisible()
  await expect(dashboardLink).toBeVisible()

  expect(unexpectedMessages(monitor)).toEqual([])
})

test('login page renders ready auth actions without console errors', async ({ page }) => {
  const monitor = new ConsoleMonitor(page)
  const googleButton = page.getByRole('button', { name: /Continue with Google/i }).first()

  await page.goto('/login', { waitUntil: 'domcontentloaded' })
  await expect(page.getByText('Please login to continue')).toBeVisible({ timeout: 15_000 })

  await expect(googleButton).toBeVisible({ timeout: 15_000 })
  await expect(googleButton).toBeEnabled({ timeout: 15_000 })
  await expect(page.getByRole('button', { name: /Cosmos Wallet/i }).first()).toBeVisible()
  await expect(page.getByText('Please login to continue')).toBeVisible()

  expect(unexpectedMessages(monitor)).toEqual([])
})

test('landing launch app CTA navigates to login', async ({ page }) => {
  const googleButton = page.getByRole('button', { name: /Continue with Google/i }).first()
  const launchAppLink = page.getByRole('link', { name: 'Launch App' }).first()

  await page.goto('/', { waitUntil: 'domcontentloaded' })
  await expect(launchAppLink).toBeVisible({ timeout: 20_000 })
  await launchAppLink.click()
  await page.waitForURL('**/login')

  await expect(googleButton).toBeVisible({ timeout: 15_000 })
})
