import {test, describe, expect, beforeEach} from '@playwright/test'

describe('Blog app', () => {
  beforeEach(async ({page, request}) => {
    await request.post('http://localhost:3003/api/testing/reset')
    await request.post('http://localhost:3003/api/users', {
      data: {
        name: 'Jamie Nevin',
        username: 'jamie',
        password: 'secret'
      }
    })

    await page.goto('http://localhost:5173')
  })

  test('Login form is shown', async ({page}) => {
    const locator = page.getByText('Log in to application')
    await expect(locator).toBeVisible()
  })

  describe('Login', () => {
    test('succeeds with correct credentials', async ({page}) => {
      await page.getByLabel('username').fill('jamie')
      await page.getByLabel('password').fill('secret')
      await page.getByRole('button', {name: 'login'}).click()

      await expect(page.getByText('Jamie Nevin logged in')).toBeVisible()
    })

    test('fails with wrong credentials', async ({page}) => {
      await page.getByLabel('username').fill('jamie')
      await page.getByLabel('password').fill('incorrect')
      await page.getByRole('button', {name: 'login'}).click()

      await expect(page.getByText('Jamie Nevin logged in')).not.toBeVisible()
    })

  })
})