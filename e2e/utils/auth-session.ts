import { expect, type BrowserContext, type Page } from '@playwright/test'

type BootstrapSessionInput = {
  verifierId: string
  email: string
  name: string
  typeOfLogin?: string
}

export async function bootstrapSessionFromLogin(
  page: Page,
  {
    verifierId,
    email,
    name,
    typeOfLogin = 'google',
  }: BootstrapSessionInput
) {
  const response = await page.context().request.post('/api/auth/login', {
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

export async function setViperUserCookie(context: BrowserContext, userId: string) {
  await context.addCookies([
    {
      name: 'viper_user_id',
      value: userId,
      domain: 'localhost',
      path: '/',
      httpOnly: true,
      secure: false,
      sameSite: 'Lax',
    },
  ])
}
