import Blog from '../models/blog'
import User from '../models/user'
import app from '../app'
import supertest from 'supertest'
import {Types} from "mongoose";
import ObjectId = module

const api = supertest(app)

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

const usersInDb = async () => {
  const users = await User.find({})
  return users.map(u => u.toJSON())
}

const login = async (username, password) => {
  const response = await api.post('/api/login').send({username, password})
  return response.body.token
}

export default {
  initialBlogs, blogsInDb, usersInDb, login
}