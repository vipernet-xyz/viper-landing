import { expect, test } from '@playwright/test'

const e2eBootstrapSecret =
  process.env.VIPER_E2E_BOOTSTRAP_SECRET || 'viper-playwright-bootstrap'

test.describe.configure({ mode: 'serial' })

test('POST /api/auth/login rejects unverified client-supplied userInfo payloads', async ({ request }) => {
  const response = await request.post('/api/auth/login', {
    data: {
      userInfo: {
        verifierId: `forged-${Date.now()}@test.local`,
        email: `forged-${Date.now()}@test.local`,
        name: 'Forged User',
        typeOfLogin: 'google',
      },
    },
  })

  expect(response.status()).toBe(401)
})

test('signed bootstrap sessions work, but forged raw cookies are rejected', async ({ browser }) => {
  const bootstrapContext = await browser.newContext()

  const bootstrapResponse = await bootstrapContext.request.post('/api/auth/login', {
    headers: {
      'x-viper-e2e-secret': e2eBootstrapSecret,
    },
    data: {
      userInfo: {
        verifierId: `bootstrap-${Date.now()}@test.local`,
        email: `bootstrap-${Date.now()}@test.local`,
        name: 'Bootstrap User',
        typeOfLogin: 'google',
      },
    },
  })

  expect(bootstrapResponse.status()).toBe(200)

  const bootstrapBody = await bootstrapResponse.json()
  const bootstrappedMe = await bootstrapContext.request.get('/api/auth/me')

  expect(bootstrappedMe.status()).toBe(200)
  expect((await bootstrappedMe.json()).user.id).toBe(bootstrapBody.user.id)

  const forgedContext = await browser.newContext()
  await forgedContext.addCookies([
    {
      name: 'viper_user_id',
      value: String(bootstrapBody.user.id),
      domain: 'localhost',
      path: '/',
      httpOnly: true,
      secure: false,
      sameSite: 'Lax',
    },
    {
      name: 'viper_wallet',
      value: 'attacker@test.local',
      domain: 'localhost',
      path: '/',
      httpOnly: false,
      secure: false,
      sameSite: 'Lax',
    },
  ])

  const forgedMe = await forgedContext.request.get('/api/auth/me')

  expect(forgedMe.status()).toBe(401)

  await bootstrapContext.close()
  await forgedContext.close()
})
