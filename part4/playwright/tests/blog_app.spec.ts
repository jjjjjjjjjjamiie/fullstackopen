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
      await createBlog(page, 'test title', 'test author', 'test url')

      await expect(page.getByText('test title test author')).toBeVisible()
    })

    test('a user can add a like to a blog', async ({page}) => {
      await createBlog(page, 'test title', 'test author', 'test url')
      await page.getByRole('button', {name: 'view'}).click()
      const previousLikes = await page.locator('.blog-likes')
      await page.getByRole('button', {name: 'like'}).click()
      const newLikes = await page.locator('.blog-likes')

      await expect(previousLikes).toContainText('0')
      await expect(newLikes).toContainText('1')
    })

    test('a user can remove a blog', async ({page}) => {
      await createBlog(page, 'test title', 'test author', 'test url')
      await page.getByRole('button', {name: 'view'}).click()
      await page.on('dialog', dialog => dialog.accept())
      await page.getByRole('button', {name: 'remove'}).click()

      const successDiv = await page.locator('.success')
      await expect(successDiv).toContainText('Successfully removed test title')
    })

    test('another user is unable to view remove button', async ({page, request}) => {
      await createBlog(page, 'test title', 'test author', 'test url')
      await request.post('http://localhost:3003/api/users', {
        data: {
          name: 'Different User',
          username: 'different',
          password: 'user'
        }
      })

      await page.getByRole('button', {name: 'logout'}).click()
      await loginWith(page, 'different', 'user')

      await page.getByRole('button', {name: 'view'}).click()

      await expect(await page.getByRole('button', {name: 'remove'})).not.toBeVisible()
    })

    test('blogs are arranged by descending number of likes', async ({page, request}) => {
      test.setTimeout(5000)

      await createBlog(page, 'title 1', 'author 1', 'url 1')
      await createBlog(page, 'title 2', 'author 2', 'url 2')
      await createBlog(page, 'title 3', 'author 3', 'url 3')

      await likeBlog(page, 'title 1', 'author 1', 1)
      await likeBlog(page, 'title 2', 'author 2', 2)
      await likeBlog(page, 'title 3', 'author 3', 3)

      await expectBlogsSortedByLikes(page)
    })
  })
})

const loginWith = async (page, username, password) => {
  await page.getByLabel('username').fill(username)
  await page.getByLabel('password').fill(password)
  await page.getByRole('button', {name: 'login'}).click()
}

const createBlog = async (page, title, author, url) => {
  await page.getByRole('button', {name: 'new blog'}).click()

  await page.getByLabel('title').fill(title)
  await page.getByLabel('author').fill(author)
  await page.getByLabel('url').fill(url)
  await page.getByRole('button', {name: 'create'}).click()
  await expect(page.getByText(`New blog ${title} by ${author} added`)).toBeVisible()
}


const blogByTitle = (page, title, author) =>
  page.locator('[data-testid="blog"]').filter({
    hasText: `${title} ${author}`,
  })

const getLikes = async (blogLocator) => {
  const likesText = await blogLocator.locator('.blog-likes').innerText()
  return parseInt(likesText.match(/\d+/)[0], 10)
}

const expandBlog = async (blogLocator) => {
  const likesLocator = blogLocator.locator('.blog-likes')
  const isVisible = await likesLocator.isVisible().catch(() => false)
  if (!isVisible) {
    await blogLocator.getByRole('button', { name: 'view' }).click()
    await expect(likesLocator).toBeVisible()
  }
  return likesLocator
}

const likeBlog = async (page, title, author, times) => {
  for (let i = 0; i < times; i++) {
    const blog = blogByTitle(page, title, author)
    const likesLocator = await expandBlog(blog)

    const before = await getLikes(blog)

    await blog.getByRole('button', { name: 'like' }).click()

    await expect(likesLocator).toHaveText(new RegExp(`^${before + 1}`))
  }
}

const expectBlogsSortedByLikes = async (page) => {
  const blogs = page.getByTestId('blog')
  const likeTexts = await blogs.locator('.blog-likes').allInnerTexts()
  const likeNumbers = likeTexts.map(text => Number(text.match(/\d+/)[0]))
  const sorted = [...likeNumbers].sort((a, b) => b - a)
  expect(likeNumbers).toEqual(sorted)
}


