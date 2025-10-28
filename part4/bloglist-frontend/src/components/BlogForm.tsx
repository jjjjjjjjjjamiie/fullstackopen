const BlogForm = ({addBlog, newBlog, handleAddTitle, handleAddAuthor, handleAddUrl}) => {
  return (
    <>
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
    </>
  )
}

export default BlogForm