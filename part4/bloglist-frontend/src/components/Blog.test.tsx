import {render, screen} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'
import {beforeEach, expect} from 'vitest'
import BlogForm from './BlogForm.tsx'

let blog

beforeEach(() => {
  blog = {
    title: 'Test blog',
    author: 'Test author',
    url: 'Test url',
    likes: 5,
    user: {
      'id': 'Test userId',
      'name': 'Test name'
    }
  }
})

test('renders title and author', () => {
  const { container } = render(<Blog blog={blog} />)

  const div = container.querySelector('.blog')
  const urlElement = screen.queryByText('Test url')
  const likesElement = screen.queryByText(5)

  expect(div).toHaveTextContent('Test blog')
  expect(div).toHaveTextContent('Test author')
  expect(urlElement).toBeNull()
  expect(likesElement).toBeNull()
})

test('renders blog details after clicking button', async () => {
  render(<Blog blog={blog} user={blog.user.id} />)

  const user = userEvent.setup()
  const button = screen.getByText('view')
  await user.click(button)

  const urlElement = screen.getByText('Test url')
  const likesElement = screen.getByText(5)

  expect(urlElement).toBeVisible()
  expect(likesElement).toBeVisible()
})

test('like button calls updateBlog correctly', async () => {
  const updateBlog = vi.fn()
  render(<Blog blog={blog} user={blog.user.id} updateBlog={updateBlog} />)

  const user = userEvent.setup()
  const viewButton = screen.getByText('view')
  await user.click(viewButton)

  const likeButton = screen.getByText('like')
  await user.click(likeButton)
  await user.click(likeButton)

  expect(updateBlog).toHaveBeenCalledTimes(2)
})

test('Blog form updates parent state and calls onSubmit', async () => {
  const createBlog = vi.fn()
  const displayNotificationMessage = vi.fn()
  render(<BlogForm createBlog={createBlog} displayNotificationMessage={displayNotificationMessage} />)
  const user = userEvent.setup()

  const newBlogButton = screen.getByText('new blog')
  await user.click(newBlogButton)

  const titleInput = screen.getByLabelText(/title/i)
  const authorInput = screen.getByLabelText(/author/i)
  const urlInput = screen.getByLabelText(/url/i)
  const sendButton = screen.getByText('create')

  await user.type(titleInput, 'title test')
  await user.type(authorInput, 'author test')
  await user.type(urlInput, 'url test')
  await user.click(sendButton)

  expect(createBlog.mock.calls).toHaveLength(1)
  expect(createBlog.mock.calls[0][0].title).toBe('title test')
  expect(createBlog.mock.calls[0][0].author).toBe('author test')
  expect(createBlog.mock.calls[0][0].url).toBe('url test')
})