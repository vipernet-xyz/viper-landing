import fs from 'fs'
import path from 'path'
import { chromium } from '@playwright/test'

const projectRoot = process.cwd()
const baseURL = process.env.PLAYWRIGHT_BASE_URL || 'http://localhost:3020'
const defaultKeplrPath =
  '/Users/dhruvsharma/Library/Application Support/Google/Chrome/Default/Extensions/dmkamcknogkgcdfhhbddcghachkejeap/0.13.11_0'
const extensionPath = path.resolve(
  process.env.E2E_COSMOS_WALLET_EXTENSION_PATH || defaultKeplrPath
)
const userDataDir = path.resolve(
  projectRoot,
  process.env.E2E_COSMOS_WALLET_USER_DATA_DIR || 'e2e/profiles/keplr'
)

if (!fs.existsSync(extensionPath)) {
  console.error(`Keplr extension not found at ${extensionPath}`)
  process.exit(1)
}

fs.mkdirSync(userDataDir, { recursive: true })

console.log(`Loading Keplr from ${extensionPath}`)
console.log(`Using persistent Chromium profile at ${userDataDir}`)
console.log('Import/connect the dedicated test wallet manually, approve the dapp connection, and wait for the address to appear.')

const context = await chromium.launchPersistentContext(userDataDir, {
  headless: false,
  viewport: { width: 1440, height: 960 },
  args: [
    `--disable-extensions-except=${extensionPath}`,
    `--load-extension=${extensionPath}`,
  ],
})

const page = context.pages()[0] || await context.newPage()

try {
  await page.goto(`${baseURL}/login`, { waitUntil: 'domcontentloaded' })

  const bodyLocator = page.locator('body')
  await bodyLocator.waitFor({ state: 'visible', timeout: 30_000 })

  const expectedAddress = process.env.E2E_COSMOS_EXPECTED_ADDRESS?.trim()
  if (expectedAddress) {
    await page.getByRole('button', { name: /Cosmos Wallet/i }).first().click()
    await page.waitForFunction(
      (address) => document.body.innerText.includes(address),
      expectedAddress,
      { timeout: 10 * 60 * 1000 }
    )
    console.log(`Detected connected address ${expectedAddress}`)
  } else {
    console.log('No E2E_COSMOS_EXPECTED_ADDRESS provided; leaving the browser open for manual wallet import/connect.')
    console.log('Press Ctrl+C in the terminal when you are done preparing the Keplr profile.')
    await new Promise(() => {})
  }
} finally {
  await context.close()
}
