import {useState} from 'react'

const Blog = ({ blog, user, updateBlog }) => {
  const [displayDetails, setDisplayDetails] = useState(false)

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  const handleUpdateLikes = async (event) => {
    event.preventDefault()

    if (user) {
      const updatedBlog = {
        ...blog,
        likes: blog.likes + 1,
        user: user.id,
      }

      await updateBlog(blog.id, updatedBlog)
    }
  }

  const blogDetails = () => (
    <div>
      <div>{blog.url}</div>
      <div>{blog.likes} <button onClick={handleUpdateLikes}>like</button></div>
      <div>{blog.user.name}</div>
    </div>
  )

  const handleDisplayDetails = (event) => {
    event.preventDefault()
    setDisplayDetails(!displayDetails);
  }

  return (
    <>
      <div style={blogStyle}>
        {blog.title} {blog.author} <button onClick={handleDisplayDetails}>{displayDetails ? 'hide' : 'view'}</button>
        {displayDetails && blogDetails()}
      </div>
    </>
  )
}

export default Blog