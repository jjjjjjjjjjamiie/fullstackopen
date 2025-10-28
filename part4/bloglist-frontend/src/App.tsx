import {useEffect, useState} from 'react'
import Blog from './components/Blog'
import Notification from './components/Notification'
import blogService from './services/blogs'
import loginService from './services/login'
import BlogForm from './components/BlogForm.tsx'

const App = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [blogs, setBlogs] = useState([])
  const [errorMessage, setErrorMessage] = useState(null)
  const [newBlog, setNewBlog] = useState({title: '', author: '', url: ''})

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
      setErrorMessage('wrong credentials')
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }
  }

  const handleLogout = (event) => {
    event.preventDefault()
    window.localStorage.removeItem('loggedBloglistUser')
    setUser(null)
  }

  const loginForm = () => (
    <>
      <h2>Log in to application</h2>
      <Notification message={errorMessage}/>
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

  const addBlog = async (event) => {
    event.preventDefault()

    if (user) {
      const response = await blogService.create(newBlog, user)
      setBlogs(blogs.concat(response.data))
    }
  }

  const handleAddTitle = (event) => {
    setNewBlog({
      ...newBlog,
      title: event.target.value
    })
  }

  const handleAddAuthor = (event) => {
    setNewBlog({
      ...newBlog,
      author: event.target.value
    })
  }

  const handleAddUrl = (event) => {
    setNewBlog({
      ...newBlog,
      url: event.target.value
    })
  }

  const blogList = () => (
    <>
      <h2>Blogs</h2>
      <form onSubmit={handleLogout}>
        <p>
          {user.name} logged in
          <button type="submit">logout</button>
        </p>
      </form>

      <BlogForm addBlog={addBlog} handleAddAuthor={handleAddAuthor} handleAddTitle={handleAddTitle} handleAddUrl={handleAddUrl} newBlog={newBlog}/>

      {blogs.map(blog =>
        <Blog key={blog.id} blog={blog} />
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