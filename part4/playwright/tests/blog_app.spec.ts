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

      const errorDiv = await page.locator('.error')
      await expect(errorDiv).toContainText('Wrong credentials')
    })
  })

  describe('When logged in', () => {
    beforeEach(async ({page}) => {
      await page.getByLabel('username').fill('jamie')
      await page.getByLabel('password').fill('secret')
      await page.getByRole('button', {name: 'login'}).click()
    })

    test('a new blog can be created', async ({page}) => {
      await page.getByRole('button', {name: 'new blog'}).click()

      await page.getByLabel('title').fill('test title')
      await page.getByLabel('author').fill('test author')
      await page.getByLabel('url').fill('test url')
      await page.getByRole('button', {name: 'create'}).click()

      await expect(page.getByText('test title test author')).toBeVisible()
    })
  })
})