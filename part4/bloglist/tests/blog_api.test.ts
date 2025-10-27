import {test, after, beforeEach, describe} from 'node:test'
import mongoose from 'mongoose'
import supertest from 'supertest'
import app from '../app'
import assert from 'node:assert'
import helper from './test_helper'
import Blog from '../models/blog'
import User from "../models/user";
import bcrypt from "bcrypt";

const api = supertest(app)

describe('when user logs in with valid token', () => {
  beforeEach(async () => {
    await User.deleteMany({})
    await Blog.deleteMany({})

    const passwordHash = await bcrypt.hash('secret', 10)
    const user = new User({username: 'root', name: 'Jimmy', passwordHash})
    await user.save()

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
        .find(key => key === 'id')

    assert.ok(result)
  })

  test('successfully create new blog post', async () => {
    const token = await helper.login('root', 'secret')
    const newBlog = {
      title: 'My beautiful wife',
      author: 'Jamie Nevin',
      url: 'website.com',
      likes: 19958,
    }

    await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const response = await api.get('/api/blogs')
    const titles = response.body.map(r => r.title)

    assert.strictEqual(response.body.length, helper.initialBlogs.length + 1)
    assert(titles.includes('My beautiful wife'))
  })

  test('new blog post defaults to 0 likes if property missing', async () => {
    const token = await helper.login('root', 'secret')
    const newBlogWithoutLikes = {
      title: 'My beautiful wife',
      author: 'Jamie Nevin',
      url: 'website.com',
    }

    await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
      .send(newBlogWithoutLikes)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const response = await api.get('/api/blogs')
    const newPost = response.body.find(r => r.title === newBlogWithoutLikes.title)

    assert.strictEqual(newPost.likes, 0)
  })

  test('new blog post returns 400 if title property missing', async () => {
    const token = await helper.login('root', 'secret')
    const newBlogWithoutTitle = {
      author: 'Jamie Nevin',
      url: 'website.com',
    }

    await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
      .send(newBlogWithoutTitle)
      .expect(400)

    const response = await api.get('/api/blogs')

    assert.strictEqual(response.body.length, helper.initialBlogs.length)
  })

  test('new blog post returns 400 if url property missing', async () => {
    const token = await helper.login('root', 'secret')
    const newBlogWithoutUrl = {
      title: 'My beautiful wife',
      author: 'Jamie Nevin',
    }

    await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
      .send(newBlogWithoutUrl)
      .expect(400)

    const response = await api.get('/api/blogs')

    assert.strictEqual(response.body.length, helper.initialBlogs.length)
  })

  test('a blog post can be deleted', async () => {
    const token = await helper.login('root', 'secret')
    const blog = {
      title: 'to be deleted',
      author: 'Jamie',
      url: 'dotcom.com',
      likes: 67,
    }

    const newBlog = await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
      .send(blog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const blogToDelete = newBlog.body

    await api
      .delete(`/api/blogs/${blogToDelete.id}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(204)

    const blogsAtEnd = await helper.blogsInDb()
    const titles = blogsAtEnd.map(blog => blog.title)

    assert(!titles.includes(blogToDelete.title))
  })

  test('when delete attempted but id not found in database returns 404', async () => {
    const token = await helper.login('root', 'secret')
    const invalidId = new mongoose.Types.ObjectId()
    const blog = {
      title: 'to be deleted',
      author: 'Jamie',
      url: 'dotcom.com',
      likes: 67,
    }

    const newBlog = await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
      .send(blog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const blogToDelete = newBlog.body

    await api
      .delete(`/api/blogs/${invalidId}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(404)

    const blogsAtEnd = await helper.blogsInDb()
    const titles = blogsAtEnd.map(blog => blog.title)

    assert(titles.includes(blogToDelete.title))
  })

  test('a blog post can update number of likes', async () => {
    const token = await helper.login('root', 'secret')
    const blogsBeforeUpdate = await helper.blogsInDb()
    const blogToUpdate = blogsBeforeUpdate[0]

    const requestBody = {
      title: blogToUpdate.title,
      author: blogToUpdate.author,
      url: blogToUpdate.url,
      likes: blogToUpdate.likes + 1,
    }

    await api
      .put(`/api/blogs/${blogToUpdate.id}`)
      .set('Authorization', `Bearer ${token}`)
      .send(requestBody)
      .expect(200)

    const blogAfterUpdate = await Blog.findById(blogToUpdate.id)

    assert.strictEqual(blogAfterUpdate.likes, blogToUpdate.likes + 1)
  })

  test('a blog post can update title and url', async () => {
    const token = await helper.login('root', 'secret')
    const blogsBeforeUpdate = await helper.blogsInDb()
    const blogToUpdate = blogsBeforeUpdate[0]
    const newTitle = 'new title'
    const newUrl = 'new url'

    const requestBody = {
      title: newTitle,
      author: blogToUpdate.author,
      url: newUrl,
      likes: blogToUpdate.likes,
    }

    await api
      .put(`/api/blogs/${blogToUpdate.id}`)
      .set('Authorization', `Bearer ${token}`)
      .send(requestBody)
      .expect(200)

    const blogAfterUpdate = await Blog.findById(blogToUpdate.id)

    assert.strictEqual(blogAfterUpdate.title, newTitle)
    assert.strictEqual(blogAfterUpdate.url, newUrl)
  })

  test('when update attempted but id not found in database returns 404', async () => {
    const token = await helper.login('root', 'secret')
    const blogsBeforeUpdate = await helper.blogsInDb()
    const blogToUpdate = blogsBeforeUpdate[0]
    const invalidId = new mongoose.Types.ObjectId();

    const requestBody = {
      title: blogToUpdate.title,
      author: blogToUpdate.author,
      url: blogToUpdate.url,
      likes: blogToUpdate.likes + 1,
    }

    await api
      .put(`/api/blogs/${invalidId}`)
      .set('Authorization', `Bearer ${token}`)
      .send(requestBody)
      .expect(404)

    const blogAfterUpdate = await Blog.findById(blogToUpdate.id)

    assert.deepStrictEqual(blogAfterUpdate.toJSON(), blogToUpdate)
  })

})

describe('when user does not have valid token', () => {
  beforeEach(async () => {
    await User.deleteMany({})
    await Blog.deleteMany({})

    const passwordHash = await bcrypt.hash('secret', 10)
    const user = new User({username: 'root', name: 'Jimmy', passwordHash})
    await user.save()

    await Blog.insertMany(helper.initialBlogs)
  })

  test('adding blog fails', async () => {
    const newBlog = {
      title: 'My beautiful wife',
      author: 'Jamie Nevin',
      url: 'website.com',
      likes: 19958,
    }

    let response = await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(401)
      .expect('Content-Type', /application\/json/)

    assert.strictEqual(response.body.error, 'token invalid')

    response = await api.get('/api/blogs')
    const titles = response.body.map(r => r.title)

    assert.strictEqual(response.body.length, helper.initialBlogs.length)
    assert(!titles.includes('My beautiful wife'))
  })
})

after(async () => {
  await mongoose.connection.close()
})