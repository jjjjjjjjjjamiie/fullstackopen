import Blog from "../models/blog";

const initialBlogs = [
  {
    title: 'My wife is so very beautiful',
    author: 'Jamie Nevin',
    url: 'dotcom',
    likes: 15000,
  },
  {
    title: 'My wife is the most beautiful woman of all time',
    author: 'Jamie Nevin',
    url: 'dotcom',
    likes: 256,
  },
]

const blogsInDb = async () => {
  const blogs = await Blog.find({})
  return blogs.map(blog => blog.toJSON())
}

export default {
  initialBlogs, blogsInDb
}