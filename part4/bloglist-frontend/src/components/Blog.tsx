import {useState} from "react";

const Blog = ({ blog, user }) => {
  const [displayDetails, setDisplayDetails] = useState(false)

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }
  const blogDetails = () => (
    <div>
      <div>{blog.url}</div>
      <div>{blog.likes} <button type="submit">like</button></div>
      <div>{user.name}</div>
    </div>
  )

  const handleDisplayDetails = (event) => {
    event.preventDefault()
    setDisplayDetails(!displayDetails);
  }

  return (
    <>
      <div style={blogStyle}>
        {blog.title} {blog.author} <button type="submit" onClick={handleDisplayDetails}>{displayDetails ? 'hide' : 'view'}</button>
        {displayDetails && blogDetails()}
      </div>
    </>
  )
}

export default Blog