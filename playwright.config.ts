import fs from 'fs'
import path from 'path'
import { defineConfig, devices } from '@playwright/test'

const macChromePath = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
const localChromeExecutable = fs.existsSync(macChromePath) ? macChromePath : undefined
const baseURL = process.env.PLAYWRIGHT_BASE_URL || 'http://localhost:3020'
const shouldStartLocalWebServer = /^http:\/\/localhost:3020\/?$/.test(baseURL)
const prSpecs = [
  '**/frontend-smoke.spec.ts',
  '**/app-creation.spec.ts',
  '**/app-creation-with-auth.spec.ts',
  '**/browser-authenticated-flow.spec.ts',
]
const nightlySpecs = [...prSpecs, '**/browser-authenticated-relay.spec.ts', '**/dashboard-crud.spec.ts']

function resolveOptionalPath(envName: string) {
  const value = process.env[envName]?.trim()
  if (!value) return undefined

  const resolved = path.isAbsolute(value) ? value : path.resolve(process.cwd(), value)
  return fs.existsSync(resolved) ? resolved : undefined
}

const realGoogleStorageState = resolveOptionalPath('E2E_REAL_GOOGLE_STORAGE_STATE')

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  testDir: './e2e',
  /* Real DB-backed E2E flows should not run in parallel locally or in CI. */
  fullyParallel: false,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,
  /* Opt out of parallel tests on CI. */
  workers: 1,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: 'html',
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Base URL to use in actions like `await page.goto('/')`. */
    baseURL,
    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: 'on-first-retry',
    /* Screenshot on failure */
    screenshot: 'only-on-failure',
    /* Video on failure */
    video: 'retain-on-failure',
  },

  /* Configure projects for major browsers */
  projects: [
    {
      name: 'pr-chromium',
      use: {
        ...devices['Desktop Chrome'],
        launchOptions: localChromeExecutable
          ? { executablePath: localChromeExecutable }
          : undefined,
      },
      testMatch: prSpecs,
    },
    {
      name: 'nightly-chromium',
      use: {
        ...devices['Desktop Chrome'],
        launchOptions: localChromeExecutable
          ? { executablePath: localChromeExecutable }
          : undefined,
      },
      testMatch: nightlySpecs,
    },
    {
      name: 'real-google-chromium',
      use: {
        ...devices['Desktop Chrome'],
        headless: false,
        storageState: realGoogleStorageState,
        launchOptions: localChromeExecutable
          ? { executablePath: localChromeExecutable }
          : undefined,
      },
      testMatch: ['**/real-google.spec.ts'],
    },
    {
      name: 'real-cosmos-wallet-chromium',
      use: {
        ...devices['Desktop Chrome'],
        headless: false,
      },
      testMatch: ['**/real-cosmos-wallet.spec.ts'],
    },
  ],

  /* Run your local dev server before starting the tests */
  webServer: shouldStartLocalWebServer
    ? {
        command: process.env.PLAYWRIGHT_WEB_SERVER_COMMAND || 'pnpm dev',
        url: baseURL,
        reuseExistingServer: !process.env.CI,
        timeout: 120000,
      }
    : undefined,
})
