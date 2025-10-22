import {test, after, beforeEach} from 'node:test'
import mongoose from 'mongoose'
import supertest from 'supertest'
import app from '../app'
import assert from "node:assert";
import Blog from "../models/blog";

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

beforeEach(async () => {
  await Blog.deleteMany({})
  let blogObject = new Blog(initialBlogs[0])
  await blogObject.save()
  blogObject = new Blog(initialBlogs[1])
  await blogObject.save()
})

test('correct number of blogs is returned', async () => {
  const response = await api.get('/api/blogs')

  assert.strictEqual(response.body.length, initialBlogs.length)
})

test('unique identifier of blog posts is correctly named id', async () => {
  const response = await api.get('/api/blogs')
  const result =
    Object
      .keys(response.body[0])
      .find(key => key === 'id');

  assert.ok(result)
})

test('successfully create new blog post', async () => {
  const newBlog = {
    title: 'My beautiful wife',
    author: 'Jamie Nevin',
    url: 'website.com',
    likes: 19958,
  }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const response = await api.get('/api/blogs')
  const titles = response.body.map(r => r.title)

  assert.strictEqual(response.body.length, initialBlogs.length + 1)
  assert(titles.includes('My beautiful wife'))
})

test('new blog post defaults to 0 likes if property missing', async () => {
  const newBlogWithoutLikes = {
    title: 'My beautiful wife',
    author: 'Jamie Nevin',
    url: 'website.com',
  }

  await api
    .post('/api/blogs')
    .send(newBlogWithoutLikes)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const response = await api.get('/api/blogs')
  const newPost = response.body.find(r => r.title === newBlogWithoutLikes.title)

  assert.strictEqual(newPost.likes, 0)
})

after(async () => {
  await mongoose.connection.close()
})