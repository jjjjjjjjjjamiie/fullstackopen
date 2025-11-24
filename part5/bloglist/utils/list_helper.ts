const dummy = (blogs) => 1

const totalLikes = (blogs) => {
  return blogs.reduce((sum, blog) => sum + blog.likes, 0)
}

const favouriteBlogs = (blogs) => {
  let reduce = blogs.reduce((mostLikes, blog) => {
    return blog.likes > mostLikes ? blog.likes : mostLikes;
  }, 0);
  return blogs.filter(blog => blog.likes === reduce)[0] ?? []
}

const mostBlogs = (blogs) => {
  if (blogs.length === 0) return {}

  const authorMap = new Map<string, number>()

  blogs.forEach(blog => {
    authorMap.set(blog.author, (authorMap.get(blog.author) ?? 0) + 1)
  })

  const maxCount = Math.max(...authorMap.values())
  return Array.from(authorMap.entries())
    .filter(([_, count]) => count === maxCount)
    .map(([author, count]) => ({author, blogs: count}))
}

const mostLikes = (blogs) => {
  if (blogs.length === 0) return {}

  const authorMap = new Map<string, number>()

  blogs.forEach(blog => {
    authorMap.set(blog.author, (authorMap.get(blog.author) ?? 0) + blog.likes)
  })

  const maxLikes = Math.max(...authorMap.values())
  return Array.from(authorMap.entries())
    .filter(([_, likes]) => likes === maxLikes)
    .map(([author, likes]) => ({author, likes: likes}))
}

export default {dummy, totalLikes, favouriteBlogs, mostBlogs, mostLikes}