import { expect, type APIRequestContext, type BrowserContext, type Page } from '@playwright/test'

type BootstrapSessionInput = {
  verifierId: string
  email: string
  name: string
  typeOfLogin?: string
}

const e2eBootstrapSecret =
  process.env.VIPER_E2E_BOOTSTRAP_SECRET || 'viper-playwright-bootstrap'

async function bootstrapRequestSession(
  request: APIRequestContext,
  {
    verifierId,
    email,
    name,
    typeOfLogin = 'google',
  }: BootstrapSessionInput
) {
  const response = await request.post('/api/auth/login', {
    headers: {
      'x-viper-e2e-secret': e2eBootstrapSecret,
    },
    data: {
      userInfo: {
        verifierId,
        email,
        name,
        typeOfLogin,
      },
    },
  })

  expect(response.status()).toBe(200)
  return response.json()
}

export async function bootstrapSessionFromLogin(page: Page, input: BootstrapSessionInput) {
  return bootstrapRequestSession(page.context().request, input)
}

export async function bootstrapContextSession(context: BrowserContext, input: BootstrapSessionInput) {
  return bootstrapRequestSession(context.request, input)
}
