import {test, after, beforeEach} from 'node:test'
import mongoose from 'mongoose'
import supertest from 'supertest'
import app from '../app'
import assert from 'node:assert';
import helper from './test_helper'
import Blog from "../models/blog";

const api = supertest(app)

beforeEach(async () => {
  await Blog.deleteMany({})
  await Blog.insertMany(helper.initialBlogs)
})

test('correct number of blogs is returned', async () => {
  const response = await api.get('/api/blogs')

  assert.strictEqual(response.body.length, helper.initialBlogs.length)
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

  assert.strictEqual(response.body.length, helper.initialBlogs.length + 1)
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

test('new blog post returns 400 if title property missing', async () => {
  const newBlogWithoutTitle = {
    author: 'Jamie Nevin',
    url: 'website.com',
  }

  await api
    .post('/api/blogs')
    .send(newBlogWithoutTitle)
    .expect(400)

  const response = await api.get('/api/blogs')

  assert.strictEqual(response.body.length, helper.initialBlogs.length)
})

test('new blog post returns 400 if url property missing', async () => {
  const newBlogWithoutUrl = {
    title: 'My beautiful wife',
    author: 'Jamie Nevin',
  }

  await api
    .post('/api/blogs')
    .send(newBlogWithoutUrl)
    .expect(400)

  const response = await api.get('/api/blogs')

  assert.strictEqual(response.body.length, helper.initialBlogs.length)
})

test('a blog post can be deleted', async () => {
  const blogsAtStart = await helper.blogsInDb()
  const blogToDelete = blogsAtStart[0]

  await api
    .delete(`/api/blogs/${blogToDelete.id}`)
    .expect(204)

  const blogsAtEnd = await helper.blogsInDb()

  const titles = blogsAtEnd.map(blog => blog.title)
  assert(!titles.includes(blogToDelete.title))

  assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length - 1)
})

test('when id not found in database returns 404', async () => {
  const invalidId = new mongoose.Types.ObjectId();

  await api
    .delete(`/api/blogs/${invalidId}`)
    .expect(404)

  const blogsAtEnd = await helper.blogsInDb()

  assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length)
})

after(async () => {
  await mongoose.connection.close()
})