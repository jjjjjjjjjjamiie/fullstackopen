import { render, screen } from '@testing-library/react'
import Blog from './Blog'

test('renders title and author', () => {
  const blog = {
    title: 'Test blog',
    author: 'Test author',
    url: 'Test url',
    likes: 5,
    user: 'Test user'
  }

  const { container } = render(<Blog blog={blog} />)

  const div = container.querySelector('.blog')
  const urlElement = screen.queryByText('Test url')
  const likesElement = screen.queryByText(5)

  expect(div).toHaveTextContent('Test blog')
  expect(div).toHaveTextContent('Test author')
  expect(urlElement).toBeNull()
  expect(likesElement).toBeNull()
})