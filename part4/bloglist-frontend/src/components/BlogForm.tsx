import {useRef, useState} from 'react'
import Togglable from './Togglable.tsx'

const BlogForm = ({createBlog, displayNotificationMessage}) => {
  const [newBlog, setNewBlog] = useState({title: '', author: '', url: ''})
  const blogFormRef = useRef()

  const addBlog = async (event) => {
    event.preventDefault()

    blogFormRef.current.toggleVisibility()
    await createBlog(newBlog)
    displayNotificationMessage(`New blog ${newBlog.title} by ${newBlog.author} added`, 'success')
    setNewBlog({title: '', author: '', url: ''})
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

  return (
    <>
      <Togglable buttonLabel='new note' ref={blogFormRef}>
        <h2>Create new</h2>
        <form onSubmit={addBlog}>
          <div>
            <label>
              title
              <input
                type="text"
                value={newBlog.title}
                onChange={handleAddTitle}
              />
            </label>
          </div>
          <div>
            <label>
              author
              <input
                type="text"
                value={newBlog.author}
                onChange={handleAddAuthor}
              />
            </label>
          </div>
          <div>
            <label>
              url
              <input
                type="text"
                value={newBlog.url}
                onChange={handleAddUrl}
              />
            </label>
          </div>
          <div><button type="submit">create</button></div>
        </form>
      </Togglable>
    </>
  )
}

export default BlogForm