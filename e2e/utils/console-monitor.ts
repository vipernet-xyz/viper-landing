import { Page, ConsoleMessage } from '@playwright/test'

export interface ConsoleError {
  type: string
  text: string
  location: string
  timestamp: Date
}

export interface ErrorAnalysis {
  hasErrors: boolean
  criticalErrors: ConsoleError[]
  warnings: ConsoleError[]
  missingProjectIdError: boolean
  apiErrors: ConsoleError[]
  corsErrors: ConsoleError[]
  fontErrors: ConsoleError[]
  allErrors: ConsoleError[]
}

/**
 * Monitor console messages and categorize errors
 */
export class ConsoleMonitor {
  private errors: ConsoleError[] = []
  private page: Page

  constructor(page: Page) {
    this.page = page
    this.setupConsoleListener()
  }

  private setupConsoleListener() {
    this.page.on('console', (msg: ConsoleMessage) => {
      const type = msg.type()
      if (type === 'error' || type === 'warning') {
        this.errors.push({
          type,
          text: msg.text(),
          location: msg.location().url,
          timestamp: new Date(),
        })
      }
    })

    // Also capture page errors
    this.page.on('pageerror', (error: Error) => {
      this.errors.push({
        type: 'error',
        text: error.message,
        location: 'page',
        timestamp: new Date(),
      })
    })
  }

  /**
   * Analyze collected errors and categorize them
   */
  analyze(): ErrorAnalysis {
    const criticalErrors: ConsoleError[] = []
    const warnings: ConsoleError[] = []
    const apiErrors: ConsoleError[] = []
    const corsErrors: ConsoleError[] = []
    const fontErrors: ConsoleError[] = []
    let missingProjectIdError = false

    for (const error of this.errors) {
      // Check for missing projectId error
      if (
        error.text.includes('projectId') &&
        error.text.includes('not provided') &&
        error.text.includes('walletConnectOptions')
      ) {
        missingProjectIdError = true
        criticalErrors.push(error)
      }

      // Check for API errors (401, 500, etc.)
      if (
        error.text.includes('Failed to load resource') ||
        error.text.includes('status of 401') ||
        error.text.includes('status of 500') ||
        error.text.includes('responded with a status')
      ) {
        apiErrors.push(error)
      }

      // Check for CORS errors
      if (
        error.text.includes('Cross-Origin-Opener-Policy') ||
        error.text.includes('CORS') ||
        error.text.includes('blocked by')
      ) {
        corsErrors.push(error)
      }

      // Check for font errors
      if (error.text.includes('Failed to decode downloaded font')) {
        fontErrors.push(error)
      }

      // Categorize by type
      if (error.type === 'error') {
        criticalErrors.push(error)
      } else if (error.type === 'warning') {
        warnings.push(error)
      }
    }

    return {
      hasErrors: this.errors.length > 0,
      criticalErrors,
      warnings,
      missingProjectIdError,
      apiErrors,
      corsErrors,
      fontErrors,
      allErrors: this.errors,
    }
  }

  /**
   * Get all collected errors
   */
  getErrors(): ConsoleError[] {
    return this.errors
  }

  /**
   * Clear all collected errors
   */
  clearErrors() {
    this.errors = []
  }

  /**
   * Print error summary
   */
  printSummary() {
    const analysis = this.analyze()
    console.log('\n=== Console Error Analysis ===')
    console.log(`Total Errors: ${analysis.criticalErrors.length}`)
    console.log(`Total Warnings: ${analysis.warnings.length}`)
    console.log(`Missing ProjectId Error: ${analysis.missingProjectIdError}`)
    console.log(`API Errors: ${analysis.apiErrors.length}`)
    console.log(`CORS Errors: ${analysis.corsErrors.length}`)
    console.log(`Font Errors: ${analysis.fontErrors.length}`)

    if (analysis.criticalErrors.length > 0) {
      console.log('\n--- Critical Errors ---')
      analysis.criticalErrors.forEach((err, i) => {
        console.log(`${i + 1}. ${err.text}`)
      })
    }
  }

  /**
   * Generate a fix report
   */
  generateFixReport(): string[] {
    const analysis = this.analyze()
    const fixes: string[] = []

    if (analysis.missingProjectIdError) {
      fixes.push(
        '❌ MISSING WALLETCONNECT PROJECT ID',
        '   Fix: Add NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID to your .env file',
        '   Get one from: https://cloud.walletconnect.com/',
        ''
      )
    }

    if (analysis.apiErrors.length > 0) {
      fixes.push(
        `❌ API ERRORS (${analysis.apiErrors.length} found)`,
        '   Fix: Ensure backend services are running and accessible',
        '   Check: Database connections, API endpoints, and authentication',
        ''
      )
    }

    if (analysis.corsErrors.length > 0) {
      fixes.push(
        `⚠️  CORS ERRORS (${analysis.corsErrors.length} found)`,
        '   Fix: Configure CORS headers on your backend',
        '   Or: Add allowed origins in your server configuration',
        ''
      )
    }

    if (analysis.fontErrors.length > 0) {
      fixes.push(
        `⚠️  FONT ERRORS (${analysis.fontErrors.length} found)`,
        '   Fix: Check font file paths and ensure fonts are accessible',
        '   Or: Use system fonts as fallback',
        ''
      )
    }

    return fixes
  }
}

/**
 * Helper function to wait for page load and capture errors
 */
export async function waitForPageLoadAndCaptureErrors(
  page: Page,
  timeout: number = 10000
): Promise<ConsoleMonitor> {
  const monitor = new ConsoleMonitor(page)

  // Wait for network to be idle
  try {
    await page.waitForLoadState('networkidle', { timeout })
  } catch (e) {
    console.log('Warning: Page did not reach networkidle state')
  }

  return monitor
}
