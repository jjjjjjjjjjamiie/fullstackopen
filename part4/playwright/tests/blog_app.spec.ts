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
      await loginWith(page, 'jamie', 'secret')

      await expect(page.getByText('Jamie Nevin logged in')).toBeVisible()
    })

    test('fails with wrong credentials', async ({page}) => {
      await loginWith(page, 'jamie', 'incorrect')

      const errorDiv = await page.locator('.error')
      await expect(errorDiv).toContainText('Wrong credentials')
    })
  })

  describe('When logged in', () => {
    beforeEach(async ({page}) => {
      await loginWith(page, 'jamie', 'secret')
    })

    test('a new blog can be created', async ({page}) => {
      await createTestBlog(page)

      await expect(page.getByText('test title test author')).toBeVisible()
    })

    test('a user can add a like to a blog', async ({page}) => {
      await createTestBlog(page)
      
      await page.getByRole('button', {name: 'view'}).click()
      const previousLikes = await page.locator('.blog-likes')
      await page.getByRole('button', {name: 'like'}).click()
      const newLikes = await page.locator('.blog-likes')

      await expect(previousLikes).toContainText('0')
      await expect(newLikes).toContainText('1')
    })
  })
})

const loginWith = async (page, username, password) => {
  await page.getByLabel('username').fill(username)
  await page.getByLabel('password').fill(password)
  await page.getByRole('button', {name: 'login'}).click()
}

const createTestBlog = async (page) => {
  await page.getByRole('button', {name: 'new blog'}).click()

  await page.getByLabel('title').fill('test title')
  await page.getByLabel('author').fill('test author')
  await page.getByLabel('url').fill('test url')
  await page.getByRole('button', {name: 'create'}).click()
}