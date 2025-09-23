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
export default {dummy, totalLikes, favouriteBlogs}