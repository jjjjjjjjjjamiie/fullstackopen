import {useState} from 'react'

const Blog = ({ blog, user, updateBlog, removeBlog }) => {
  const [displayDetails, setDisplayDetails] = useState(false)

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  const handleUpdateLikes = async () => {
    if (user) {
      const updatedBlog = {
        ...blog,
        likes: blog.likes + 1,
        user: user.id,
      }

      await updateBlog(blog.id, updatedBlog)
    }
  }

  const handleRemoveBlog = async () => {
    if (user) {
      await removeBlog(blog)
    }
  }

  const blogDetails = () => (
    <div>
      <div>{blog.url}</div>
      <div className='blog-likes'>{blog.likes} <button onClick={handleUpdateLikes}>like</button></div>
      <div>{blog.user.name}</div>
      {
        user.id === blog.user.id &&
        <button onClick={handleRemoveBlog}>remove</button>
      }
    </div>
  )

  const handleDisplayDetails = () => {
    setDisplayDetails(!displayDetails)
  }

  return (
    <>
      <div style={blogStyle} className='blog' data-testid="blog">
        {blog.title} {blog.author}
        <button onClick={handleDisplayDetails}>{displayDetails ? 'hide' : 'view'}</button>
        {displayDetails && blogDetails()}
      </div>
    </>
  )
}

export default Blog