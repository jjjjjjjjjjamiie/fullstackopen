import {useEffect, useState} from 'react'
import Blog from './components/Blog'
import Notification from './components/Notification'
import blogService from './services/blogs'
import loginService from './services/login'
import BlogForm from './components/BlogForm.tsx'
import './index.css'

const App = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [blogs, setBlogs] = useState([])
  const [notificationMessage, setNotificationMessage] = useState(null)
  const [notificationType, setNotificationType] = useState('')

  useEffect(() => {
    (async () => setBlogs(await blogService.getAll()))()
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBloglistUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
    }
  }, [])

  const handleLogin = async (event) => {
    event.preventDefault()

    try {
      const user = await loginService.login({ username, password })
      window.localStorage.setItem('loggedBloglistUser', JSON.stringify(user))

      setUser(user)
      setUsername('')
      setPassword('')
    } catch {
      displayNotificationMessage('Wrong credentials', 'error')
    }
  }

  const handleLogout = (event) => {
    event.preventDefault()
    window.localStorage.removeItem('loggedBloglistUser')
    setUser(null)
  }

  const displayNotificationMessage = (message, type) => {
    setNotificationType(type)
    setNotificationMessage(message)
    setTimeout(() => {
      setNotificationMessage(null)
    }, 5000)
  }

  const loginForm = () => (
    <>
      <h2>Log in to application</h2>
      <Notification message={notificationMessage} type={notificationType}/>
      <form onSubmit={handleLogin}>
        <div>
          <label>
            username
            <input
              type="text"
              value={username}
              onChange={({ target }) => setUsername(target.value)}
            />
          </label>
        </div>
        <div>
          <label>
            password
            <input
              type="password"
              value={password}
              onChange={({ target }) => setPassword(target.value)}
            />
          </label>
        </div>
        <button type="submit">login</button>
      </form>
    </>
  )

  const addBlog = async (blogObject) => {
    if (user) {
      const response = await blogService.create(blogObject, user)
      setBlogs(blogs.concat(response.data))
    }
  }

  const blogList = () => (
    <>
      <h2>Blogs</h2>
      <Notification message={notificationMessage} type={notificationType}/>
      <form onSubmit={handleLogout}>
        <p>
          {user.name} logged in
          <button type="submit">logout</button>
        </p>
      </form>
      <BlogForm  createBlog={addBlog} displayNotificationMessage={displayNotificationMessage}/>
      {blogs.map(blog =>
        <Blog key={blog.id} blog={blog} user={user} />
      )}
    </>
  )

  return (
    <>
      {!user && loginForm()}
      {user && blogList()}
    </>
  )
}

export default App