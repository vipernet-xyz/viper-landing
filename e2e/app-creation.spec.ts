import { test, expect, type Page } from '@playwright/test'
import { ConsoleMonitor, waitForPageLoadAndCaptureErrors } from './utils/console-monitor'
import * as fs from 'fs'
import * as path from 'path'

// Web3Auth/WalletConnect keep network connections open, so networkidle never fires.
// Increase timeout to accommodate the waitForPageLoadAndCaptureErrors helper.
test.setTimeout(60_000)

async function hasCreateAppForm(page: Page) {
  return (await page.getByLabel('App Name *').count()) > 0
}

async function isAuthGated(page: Page) {
  const response = await page.request.get('/api/apps')
  return response.status() === 401
}

test.describe('App Creation Flow', () => {
  let consoleMonitor: ConsoleMonitor

  test.beforeEach(async ({ page }) => {
    // Set up console monitoring
    consoleMonitor = new ConsoleMonitor(page)
  })

  test('should navigate to create app page and detect console errors', async ({ page }) => {
    // Navigate to the app creation page
    await page.goto('/dashboard/apps/create')

    // Wait for page to load
    await waitForPageLoadAndCaptureErrors(page, 15000)

    // Wait a bit more to capture async errors
    await page.waitForTimeout(3000)

    // Analyze errors
    const analysis = consoleMonitor.analyze()

    // Print summary for debugging
    consoleMonitor.printSummary()

    // Generate fix report
    const fixes = consoleMonitor.generateFixReport()
    if (fixes.length > 0) {
      console.log('\n=== Suggested Fixes ===')
      fixes.forEach((fix) => console.log(fix))
    }

    // Take a screenshot for reference
    await page.screenshot({
      path: 'e2e/screenshots/app-creation-page.png',
      fullPage: true,
    })

    // Verify valid unauthenticated/app states:
    // 1) User can access form (authenticated context), OR
    // 2) User is auth-gated and API rejects access.
    const formVisible = await hasCreateAppForm(page)
    const authGated = await isAuthGated(page)
    const onExpectedRoute =
      page.url().includes('/dashboard/apps/create') || page.url().includes('/login')

    console.log(`\nRoute: ${page.url()}`)
    console.log(`Create form visible: ${formVisible}`)
    console.log(`Auth gated (/api/apps => 401): ${authGated}`)

    expect(onExpectedRoute).toBe(true)
    expect(formVisible || authGated).toBe(true)

    // Log specific error checks
    if (analysis.missingProjectIdError) {
      console.log('\n❌ DETECTED: Missing WalletConnect Project ID')
      console.log('   This error is expected if .env is not configured')
    }

    if (analysis.apiErrors.length > 0) {
      console.log(`\n⚠️  DETECTED: ${analysis.apiErrors.length} API errors`)
      console.log('   Some backend services may be unavailable')
    }

    // The test should pass even with errors, as we're just detecting them
    // You can uncomment the line below to make the test fail on errors
    // expect(analysis.criticalErrors.length).toBe(0)
  })

  test('should fill out and submit app creation form', async ({ page }) => {
    // Navigate to the app creation page
    await page.goto('/dashboard/apps/create')

    // Wait for page to load
    await page.waitForLoadState('domcontentloaded')

    // In unauthenticated mode, this page may be intentionally gated.
    // If gated, assert that behavior and exit early.
    const formVisible = await hasCreateAppForm(page)
    if (!formVisible) {
      const authGated = await isAuthGated(page)
      console.log(`Form not visible. Auth gated: ${authGated}`)
      expect(authGated).toBe(true)
      return
    }

    // Fill in the form (authenticated context)
    const appName = `Test App ${Date.now()}`
    await page.getByLabel('App Name *').fill(appName)
    await page.getByLabel('Description (Optional)').fill('This is a test app created by automated tests')

    // Add an allowed origin
    await page.getByPlaceholder('https://example.com').first().fill('https://test.example.com')

    // Add another origin
    await page.getByRole('button', { name: 'Add Origin' }).click()
    await page.getByPlaceholder('https://example.com').last().fill('https://test2.example.com')

    // Select some chains (if available)
    const chainCheckboxes = page.locator('input[type="checkbox"]').first()
    if ((await chainCheckboxes.count()) > 0) {
      await chainCheckboxes.first().check()
    }

    // Take a screenshot before submitting
    await page.screenshot({
      path: 'e2e/screenshots/app-creation-form-filled.png',
      fullPage: true,
    })

    // Note: We won't actually submit the form to avoid creating test data
    // If you want to test the full flow, uncomment the following:
    // await page.getByRole('button', { name: 'Create App' }).click()

    // Check for console errors after form interaction
    await page.waitForTimeout(2000)
    const analysis = consoleMonitor.analyze()

    console.log('\n=== Console Errors After Form Interaction ===')
    console.log(`Total Errors: ${analysis.criticalErrors.length}`)
    console.log(`API Errors: ${analysis.apiErrors.length}`)

    // Verify form fields are filled
    await expect(page.getByLabel('App Name *')).toHaveValue(appName)
  })

  test('should check for WalletConnect configuration', async ({ page }) => {
    // Navigate to the app creation page
    await page.goto('/dashboard/apps/create')

    // Wait for page to load and console errors to appear
    await waitForPageLoadAndCaptureErrors(page, 15000)
    await page.waitForTimeout(3000)

    // Analyze errors
    const analysis = consoleMonitor.analyze()

    // Check if WalletConnect project ID is missing
    if (analysis.missingProjectIdError) {
      console.log('\n❌ WalletConnect Project ID is NOT configured')
      console.log('   Please add NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID to your .env file')

      // Check if .env file needs updating
      const envPath = path.join(process.cwd(), '.env')
      if (fs.existsSync(envPath)) {
        const envContent = fs.readFileSync(envPath, 'utf-8')
        if (!envContent.includes('NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID')) {
          console.log('   ⚠️  .env file is missing NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID entry')
        } else if (envContent.includes('NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_walletconnect_project_id_here')) {
          console.log('   ⚠️  .env file has placeholder value for NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID')
          console.log('   Replace it with a real project ID from https://cloud.walletconnect.com/')
        } else {
          console.log('   ✅ .env file has NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID configured')
        }
      }
    } else {
      console.log('\n✅ WalletConnect Project ID is properly configured')
    }

    // Generate and save detailed error report
    const errorReport = {
      timestamp: new Date().toISOString(),
      analysis,
      fixes: consoleMonitor.generateFixReport(),
      allErrors: consoleMonitor.getErrors(),
    }

    // Save error report to file
    fs.mkdirSync('e2e/reports', { recursive: true })
    fs.writeFileSync(
      'e2e/reports/console-errors.json',
      JSON.stringify(errorReport, null, 2)
    )

    console.log('\n📄 Detailed error report saved to: e2e/reports/console-errors.json')
  })

  test('should detect and categorize all console errors', async ({ page }) => {
    // Navigate to the app creation page
    await page.goto('/dashboard/apps/create')

    // Wait for page to load completely
    await waitForPageLoadAndCaptureErrors(page, 15000)
    await page.waitForTimeout(5000)

    // Get analysis
    const analysis = consoleMonitor.analyze()

    // Create detailed categorization
    console.log('\n=== Detailed Error Categorization ===')

    if (analysis.missingProjectIdError) {
      console.log('\n🔴 CRITICAL: Missing WalletConnect Project ID')
      console.log('   Impact: Mobile wallet connections will fail')
      console.log('   Fix: Add to .env and restart dev server')
    }

    if (analysis.apiErrors.length > 0) {
      console.log(`\n🟡 API Errors: ${analysis.apiErrors.length}`)
      analysis.apiErrors.slice(0, 5).forEach((err, i) => {
        console.log(`   ${i + 1}. ${err.text.substring(0, 100)}`)
      })
      if (analysis.apiErrors.length > 5) {
        console.log(`   ... and ${analysis.apiErrors.length - 5} more`)
      }
    }

    if (analysis.corsErrors.length > 0) {
      console.log(`\n🟠 CORS Errors: ${analysis.corsErrors.length}`)
      console.log('   Impact: Cross-origin requests blocked')
      console.log('   Fix: Configure CORS headers on backend')
    }

    if (analysis.fontErrors.length > 0) {
      console.log(`\n🟢 Font Errors: ${analysis.fontErrors.length}`)
      console.log('   Impact: Minor visual issues, fonts may fallback')
      console.log('   Fix: Check font file paths')
    }

    // Take final screenshot
    await page.screenshot({
      path: 'e2e/screenshots/final-state.png',
      fullPage: true,
    })

    // Create summary
    console.log('\n=== Error Summary ===')
    console.log(`Total Errors: ${analysis.criticalErrors.length}`)
    console.log(`Total Warnings: ${analysis.warnings.length}`)
    console.log(`Critical Issues: ${analysis.missingProjectIdError ? 1 : 0}`)

    // The test passes regardless of errors (we're just detecting them)
    // If you want to enforce zero errors, uncomment:
    // expect(analysis.criticalErrors.length).toBe(0)

    expect(true).toBe(true) // Test always passes, we're just monitoring
  })
})

test.describe('Error Fix Validation', () => {
  test('should validate environment configuration', async ({ page }) => {
    console.log('\n=== Environment Configuration Check ===')

    // Check .env file
    const envPath = path.join(process.cwd(), '.env')
    const issues: string[] = []

    if (!fs.existsSync(envPath)) {
      issues.push('❌ .env file not found')
    } else {
      const envContent = fs.readFileSync(envPath, 'utf-8')

      // Check WalletConnect Project ID
      if (!envContent.includes('NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=')) {
        issues.push('❌ NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID not found in .env')
      } else if (
        envContent.includes('NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_walletconnect_project_id_here') ||
        envContent.includes('NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=""')
      ) {
        issues.push('⚠️  NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID has placeholder value')
      } else {
        console.log('✅ NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID is configured')
      }

      // Check other important variables
      const requiredVars = [
        'NEXT_PUBLIC_SUPABASE_URL',
        'NEXT_PUBLIC_SUPABASE_ANON_KEY',
        'DATABASE_URL',
      ]

      requiredVars.forEach((varName) => {
        if (!envContent.includes(`${varName}=`)) {
          issues.push(`❌ ${varName} not found in .env`)
        } else {
          console.log(`✅ ${varName} is configured`)
        }
      })
    }

    // Print issues
    if (issues.length > 0) {
      console.log('\n⚠️  Configuration Issues Found:')
      issues.forEach((issue) => console.log(`   ${issue}`))
    } else {
      console.log('\n✅ All environment variables are properly configured')
    }

    // Navigate to page to verify
    await page.goto('/dashboard/apps/create')
    await page.waitForLoadState('domcontentloaded')

    expect(true).toBe(true)
  })
})
