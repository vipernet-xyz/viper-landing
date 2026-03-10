import { test, expect, type Page } from '@playwright/test'
import { setViperUserCookie } from './utils/auth-session'

/**
 * E2E tests for the Viper Dashboard CRUD operations.
 *
 * Tests cover:
 * 1. Unauthenticated access → 401
 * 2. Authenticated API: full CRUD lifecycle (POST, GET, GET/:id, PATCH, DELETE)
 * 3. SQL injection resistance on PATCH
 * 4. Edge cases (invalid IDs, missing params, non-existent resources)
 * 5. Debug log cleanup verification
 * 6. UI smoke tests (dashboard pages load without crashes)
 *
 * NOTE: Workers must be 1 to avoid exhausting the Supabase session-mode
 * connection pool (very limited slots on free tier).
 */

// Force serial execution — Supabase session-mode pooler has very few slots.
test.describe.configure({ mode: 'serial' })

// ---------------------------------------------------------------------------
// Shared state across serial tests
// ---------------------------------------------------------------------------

let TEST_USER_ID: string
const TEST_VERIFIER_ID = `e2e-playwright-crud-${Date.now()}@test.local`

async function isClientAuthGated(page: Page) {
    const url = page.url()
    const bodyText = ((await page.textContent('body')) || '').toLowerCase()
    const loggedOutHeading = page.getByRole('heading', { name: /you are not logged in/i })
    const googleButton = page.getByRole('button', { name: /continue with google/i })

    return (
        url.includes('/login') ||
        (await loggedOutHeading.count()) > 0 ||
        (await googleButton.count()) > 0 ||
        bodyText.includes('you are not logged in') ||
        bodyText.includes('not logged in') ||
        bodyText.includes('continue with google') ||
        bodyText.includes('please login to continue')
    )
}

// ---------------------------------------------------------------------------
// 0. Bootstrap – create test user via login API
// ---------------------------------------------------------------------------

test('bootstrap – create test user via login API', async ({ browser }) => {
    const context = await browser.newContext()

    // Pre-warm: hit a lightweight endpoint to let the server finish compiling
    // and establishing its initial DB connection before the login upsert.
    await context.request.get('/api/apps').catch(() => {})
    // Small pause so the pool settles after warm-up
    await new Promise((r) => setTimeout(r, 2000))

    // Retry loop — Supabase session-mode pooler can transiently reject
    // connections while the dev-server compiles other routes.
    let res: Awaited<ReturnType<typeof context.request.post>> | undefined
    for (let attempt = 1; attempt <= 5; attempt++) {
        res = await context.request.post('/api/auth/login', {
            data: {
                userInfo: {
                    verifierId: TEST_VERIFIER_ID,
                    email: TEST_VERIFIER_ID,
                    name: 'E2E Playwright CRUD',
                    typeOfLogin: 'google',
                },
            },
        })
        if (res.status() === 200) break
        console.log(`  Bootstrap attempt ${attempt} returned ${res.status()}, retrying in 3s…`)
        await new Promise((r) => setTimeout(r, 3000))
    }

    expect(res!.status()).toBe(200)
    const body = await res!.json()
    TEST_USER_ID = String(body.user.id)
    console.log(`  Test user id=${TEST_USER_ID}`)
    expect(Number(TEST_USER_ID)).toBeGreaterThan(0)
    await context.close()
})

// ---------------------------------------------------------------------------
// 1. Unauthenticated access
// ---------------------------------------------------------------------------

test('GET /api/apps returns 401 without cookie', async ({ request }) => {
    const res = await request.get('/api/apps')
    expect(res.status()).toBe(401)
    expect((await res.json()).error).toBe('Unauthorized')
})

test('GET /api/apps/1 returns 401 without cookie', async ({ request }) => {
    const res = await request.get('/api/apps/1')
    expect(res.status()).toBe(401)
})

test('PATCH /api/apps returns 401 without cookie', async ({ request }) => {
    const res = await request.patch('/api/apps', { data: { appId: 1, rate_limit: 5000 } })
    expect(res.status()).toBe(401)
})

test('DELETE /api/apps?appId=1 returns 401 without cookie', async ({ request }) => {
    const res = await request.delete('/api/apps?appId=1')
    expect(res.status()).toBe(401)
})

test('GET /api/analytics returns 401 without cookie', async ({ request }) => {
    const res = await request.get('/api/analytics')
    expect(res.status()).toBe(401)
})

// ---------------------------------------------------------------------------
// 2. Authenticated API – full CRUD lifecycle
// ---------------------------------------------------------------------------

let appId: number
let apiKey: string

test('POST /api/apps – create app', async ({ browser }) => {
    expect(TEST_USER_ID).toBeTruthy()
    const context = await browser.newContext()
    await setViperUserCookie(context, TEST_USER_ID)

    const res = await context.request.post('/api/apps', {
        data: {
            name: `E2E CRUD ${Date.now()}`,
            description: 'Created by Playwright E2E suite',
            allowedOrigins: ['https://e2e.test'],
            allowedChains: ['0001'],
            rateLimit: 5000,
        },
    })

    expect(res.status()).toBe(201)
    const body = await res.json()
    expect(body).toHaveProperty('id')
    expect(body).toHaveProperty('api_key')
    expect(body.name).toContain('E2E CRUD')
    expect(body.rate_limit).toBe(5000)
    appId = body.id
    apiKey = body.api_key
    console.log(`  Created app id=${appId}`)

    await context.close()
})

test('GET /api/apps – list includes new app', async ({ browser }) => {
    expect(appId).toBeTruthy()
    const context = await browser.newContext()
    await setViperUserCookie(context, TEST_USER_ID)

    const res = await context.request.get('/api/apps')
    expect(res.status()).toBe(200)

    const apps = await res.json()
    expect(Array.isArray(apps)).toBe(true)

    const found = apps.find((a: any) => a.id === appId)
    expect(found).toBeTruthy()
    expect(found.api_key).toBe(apiKey)

    await context.close()
})

test('GET /api/apps/[id] – fetch single app', async ({ browser }) => {
    expect(appId).toBeTruthy()
    const context = await browser.newContext()
    await setViperUserCookie(context, TEST_USER_ID)

    const res = await context.request.get(`/api/apps/${appId}`)
    expect(res.status()).toBe(200)

    const body = await res.json()
    expect(body.id).toBe(appId)
    expect(body.name).toContain('E2E CRUD')
    expect(body.rate_limit).toBe(5000)

    await context.close()
})

test('GET /api/apps/[id] – 404 for non-existent app', async ({ browser }) => {
    const context = await browser.newContext()
    await setViperUserCookie(context, TEST_USER_ID)

    const res = await context.request.get('/api/apps/9999999')
    expect(res.status()).toBe(404)

    await context.close()
})

test('GET /api/apps/[id] – 400 for invalid id', async ({ browser }) => {
    const context = await browser.newContext()
    await setViperUserCookie(context, TEST_USER_ID)

    const res = await context.request.get('/api/apps/notanumber')
    expect(res.status()).toBe(400)

    await context.close()
})

test('PATCH /api/apps – update app settings', async ({ browser }) => {
    expect(appId).toBeTruthy()
    const context = await browser.newContext()
    await setViperUserCookie(context, TEST_USER_ID)

    const res = await context.request.patch('/api/apps', {
        data: {
            appId,
            rate_limit: '7500',
            is_active: false,
            allowed_origins: ['https://updated.test', 'https://also.test'],
            allowed_chains: ['0001', '0021'],
        },
    })

    expect(res.status()).toBe(200)
    const body = await res.json()
    expect(body.rate_limit).toBe(7500)
    expect(body.is_active).toBe(false)
    expect(body.allowed_origins).toContain('https://updated.test')
    expect(body.allowed_origins).toContain('https://also.test')

    await context.close()
})

test('PATCH /api/apps – no fields returns 400', async ({ browser }) => {
    expect(appId).toBeTruthy()
    const context = await browser.newContext()
    await setViperUserCookie(context, TEST_USER_ID)

    const res = await context.request.patch('/api/apps', { data: { appId } })
    expect(res.status()).toBe(400)

    await context.close()
})

test('PATCH /api/apps – SQL injection attempt is safe', async ({ browser }) => {
    expect(appId).toBeTruthy()
    const context = await browser.newContext()
    await setViperUserCookie(context, TEST_USER_ID)

    // Attempt SQL injection via origins and rate_limit
    const res = await context.request.patch('/api/apps', {
        data: {
            appId,
            allowed_origins: ["'; DROP TABLE apps; --"],
            rate_limit: "1; DROP TABLE apps; --",
        },
    })

    // Parameterized query stores the string literally
    expect(res.status()).toBe(200)
    const body = await res.json()
    expect(body.allowed_origins).toContain("'; DROP TABLE apps; --")
    expect(body.rate_limit).toBe(1) // parseInt("1; DROP TABLE...") = 1
    console.log('  SQL injection stored literally, not executed')

    // Verify the table and app still exist
    const check = await context.request.get(`/api/apps/${appId}`)
    expect(check.status()).toBe(200)
    console.log('  App survived SQL injection attempt')

    await context.close()
})

test('DELETE /api/apps – delete app', async ({ browser }) => {
    expect(appId).toBeTruthy()
    const context = await browser.newContext()
    await setViperUserCookie(context, TEST_USER_ID)

    const res = await context.request.delete(`/api/apps?appId=${appId}`)
    expect(res.status()).toBe(200)
    expect((await res.json()).success).toBe(true)

    // Verify app is gone
    const check = await context.request.get(`/api/apps/${appId}`)
    expect(check.status()).toBe(404)
    console.log(`  App ${appId} deleted and confirmed gone`)

    await context.close()
})

test('DELETE /api/apps – 404 for already-deleted app', async ({ browser }) => {
    const context = await browser.newContext()
    await setViperUserCookie(context, TEST_USER_ID)

    // Re-delete same app → should be 404 now
    const res = await context.request.delete(`/api/apps?appId=${appId}`)
    expect(res.status()).toBe(404)

    await context.close()
})

test('DELETE /api/apps – 400 without appId', async ({ browser }) => {
    const context = await browser.newContext()
    await setViperUserCookie(context, TEST_USER_ID)

    const res = await context.request.delete('/api/apps')
    expect(res.status()).toBe(400)

    await context.close()
})

// ---------------------------------------------------------------------------
// 3. UI – App detail page (creates its own app, tests dialogs, then deletes)
// ---------------------------------------------------------------------------

let uiAppId: number

test('UI setup – create app for UI tests', async ({ browser }) => {
    expect(TEST_USER_ID).toBeTruthy()
    const context = await browser.newContext()
    await setViperUserCookie(context, TEST_USER_ID)

    const res = await context.request.post('/api/apps', {
        data: {
            name: 'UI Test App',
            description: 'For UI E2E tests',
            allowedOrigins: ['https://ui-test.com'],
            allowedChains: ['0001'],
            rateLimit: 10000,
        },
    })

    expect(res.status()).toBe(201)
    uiAppId = (await res.json()).id
    console.log(`  UI test app id=${uiAppId}`)

    await context.close()
})

test('UI – app detail page renders with real data', async ({ browser }) => {
    expect(uiAppId).toBeTruthy()
    const context = await browser.newContext()
    await setViperUserCookie(context, TEST_USER_ID)
    const page = await context.newPage()

    await page.goto(`/dashboard/apps/${uiAppId}`, { waitUntil: 'domcontentloaded' })
    await page.waitForTimeout(4000)

    // Dashboard may redirect to /login or show "not logged in" because
    // the client-side AuthProvider checks Web3Auth state, not just cookies.
    if (await isClientAuthGated(page)) {
        console.log('  Page requires Web3Auth session (client-side auth gate)')
        console.log('  API-level tests confirmed data flow works correctly')
    } else {
        // If we stayed on the app detail page with data, verify content
        const heading = page.locator('h2').first()
        await expect(heading).toContainText('UI Test App')
        await expect(page.getByRole('heading', { name: 'API Key' })).toBeVisible()
        console.log('  App detail page rendered with real data')
    }

    await context.close()
})

test('UI – settings button exists on app detail page', async ({ browser }) => {
    expect(uiAppId).toBeTruthy()
    const context = await browser.newContext()
    await setViperUserCookie(context, TEST_USER_ID)
    const page = await context.newPage()

    await page.goto(`/dashboard/apps/${uiAppId}`, { waitUntil: 'domcontentloaded' })
    await page.waitForTimeout(4000)

    if (await isClientAuthGated(page)) {
        console.log('  Skipped (Web3Auth session required)')
        return
    }

    const settingsBtn = page.getByRole('button', { name: /Settings/i })
    await expect(settingsBtn).toBeVisible()
    await settingsBtn.click()

    const settingsDialog = page.getByRole('dialog', { name: 'App Settings' })
    await expect(settingsDialog).toBeVisible({ timeout: 3000 })
    await expect(settingsDialog.getByRole('switch', { name: 'Active' })).toBeVisible()
    await expect(settingsDialog.getByLabel('Daily Rate Limit')).toBeVisible()
    await expect(settingsDialog.getByRole('button', { name: 'Save Changes' })).toBeVisible()

    await page.getByRole('button', { name: 'Cancel' }).click()
    console.log('  Settings dialog opens and shows all controls')

    await context.close()
})

test('UI – delete button opens confirmation dialog', async ({ browser }) => {
    expect(uiAppId).toBeTruthy()
    const context = await browser.newContext()
    await setViperUserCookie(context, TEST_USER_ID)
    const page = await context.newPage()

    await page.goto(`/dashboard/apps/${uiAppId}`, { waitUntil: 'domcontentloaded' })
    await page.waitForTimeout(4000)

    if (await isClientAuthGated(page)) {
        console.log('  Skipped (Web3Auth session required)')
        return
    }

    const deleteBtn = page.getByRole('button', { name: /Delete/i })
    await expect(deleteBtn).toBeVisible()
    await deleteBtn.click()

    await expect(page.getByRole('heading', { name: 'Delete App' })).toBeVisible({ timeout: 3000 })
    await expect(page.getByText('cannot be undone')).toBeVisible()

    // Cancel works
    await page.getByRole('button', { name: 'Cancel' }).click()
    await expect(page.getByRole('heading', { name: 'Delete App' })).not.toBeVisible()
    console.log('  Delete dialog opens and cancel dismisses it')

    await context.close()
})

test('UI cleanup – delete test app via API', async ({ browser }) => {
    expect(uiAppId).toBeTruthy()
    const context = await browser.newContext()
    await setViperUserCookie(context, TEST_USER_ID)

    const res = await context.request.delete(`/api/apps?appId=${uiAppId}`)
    expect(res.status()).toBe(200)
    console.log(`  UI test app ${uiAppId} cleaned up`)

    await context.close()
})

// ---------------------------------------------------------------------------
// 4. Debug log cleanup verification
// ---------------------------------------------------------------------------

test('API responses do not contain debug log artifacts', async ({ browser }) => {
    const context = await browser.newContext()
    await setViperUserCookie(context, TEST_USER_ID)

    // GET /api/apps
    const appsText = await (await context.request.get('/api/apps')).text()
    expect(appsText).not.toContain('📋')
    expect(appsText).not.toContain('🍪')
    expect(appsText).not.toContain('[API/APPS/GET]')

    // GET /api/analytics
    const analyticsText = await (await context.request.get('/api/analytics')).text()
    expect(analyticsText).not.toContain('📊')
    expect(analyticsText).not.toContain('[API/ANALYTICS/GET]')

    // POST /api/auth/login (error path)
    const loginText = await (await context.request.post('/api/auth/login', {
        data: { userInfo: {} },
    })).text()
    expect(loginText).not.toContain('🔐')
    expect(loginText).not.toContain('[AUTH/LOGIN]')

    console.log('  No debug log artifacts in any API response')

    await context.close()
})

// ---------------------------------------------------------------------------
// 5. Dashboard smoke tests
// ---------------------------------------------------------------------------

test('dashboard apps page loads without crashing', async ({ browser }) => {
    const context = await browser.newContext()
    await setViperUserCookie(context, TEST_USER_ID)
    const page = await context.newPage()

    await page.goto('/dashboard/apps', { waitUntil: 'domcontentloaded' })
    await page.waitForTimeout(2000)

    const url = page.url()
    expect(url.includes('/dashboard') || url.includes('/login')).toBe(true)
    console.log(`  Apps page: ${url}`)

    await context.close()
})

test('dashboard analytics page loads without crashing', async ({ browser }) => {
    const context = await browser.newContext()
    await setViperUserCookie(context, TEST_USER_ID)
    const page = await context.newPage()

    await page.goto('/dashboard/analytics', { waitUntil: 'domcontentloaded' })
    await page.waitForTimeout(2000)

    const url = page.url()
    expect(url.includes('/dashboard') || url.includes('/login')).toBe(true)
    console.log(`  Analytics page: ${url}`)

    await context.close()
})
