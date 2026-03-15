import fs from 'fs'
import path from 'path'
import { chromium } from '@playwright/test'

const projectRoot = process.cwd()
const baseURL = process.env.PLAYWRIGHT_BASE_URL || 'http://localhost:3020'
const outputPath = path.resolve(
  projectRoot,
  process.env.E2E_REAL_GOOGLE_STORAGE_STATE || 'e2e/auth-state/google-user.json'
)
const macChromePath = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'

fs.mkdirSync(path.dirname(outputPath), { recursive: true })

const browser = await chromium.launch({
  headless: false,
  executablePath: fs.existsSync(macChromePath) ? macChromePath : undefined,
  slowMo: 50,
})

const context = await browser.newContext()
const page = await context.newPage()

console.log(`Opening ${baseURL}/login in a headed browser.`)
console.log('Complete the Google/Web3Auth login manually, then wait for the dashboard to load.')
console.log(`Storage state will be saved to: ${outputPath}`)

await page.goto(`${baseURL}/login`, { waitUntil: 'domcontentloaded' })

try {
  await page.waitForURL(/\/dashboard(\/|$)/, { timeout: 10 * 60 * 1000 })
  await context.storageState({ path: outputPath })
  console.log(`Saved Google auth storage state to ${outputPath}`)
} catch (error) {
  console.error('Timed out waiting for dashboard navigation after manual login.')
  console.error(error)
  process.exitCode = 1
} finally {
  await browser.close()
}
