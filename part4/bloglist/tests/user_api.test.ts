import bcrypt from 'bcrypt'
import User from '../models/user'
import {after, beforeEach, describe, test} from 'node:test'
import helper from './test_helper'
import supertest from "supertest";
import app from "../app";
import assert from "node:assert";
import mongoose from "mongoose";

const api = supertest(app)

describe('when there is initially one user in db', () => {
  beforeEach(async () => {
    await User.deleteMany({})

    const passwordHash = await bcrypt.hash('secret', 10)
    const user = new User({username: 'root', passwordHash})

    await user.save()
  })

  test('creation succeeds with a fresh username', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'jjamiie',
      name: 'Jimmy Nuggets',
      password: 'shhhhh',
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await helper.usersInDb()
    assert.strictEqual(usersAtEnd.length, usersAtStart.length + 1)

    const usernames = usersAtEnd.map(u => u.username)
    assert(usernames.includes(newUser.username))
  })

  test('adding new user fails if username already taken', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'root',
      name: 'Jimmy Nuggets',
      password: 'shhhhh',
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await helper.usersInDb()

    assert(result.body.error.includes('Username must be unique'))
    assert.strictEqual(usersAtEnd.length, usersAtStart.length)
  })

  test('adding new user fails if username too short', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'ba',
      name: 'Jimmy Nuggets',
      password: 'shhhhh',
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await helper.usersInDb()

    assert(result.body.error.includes('shorter than the minimum allowed length'))
    assert.strictEqual(usersAtEnd.length, usersAtStart.length)
  })

  test('adding new user fails if password too short', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'baaaaaa',
      name: 'Jimmy Nuggets',
      password: 'sh',
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await helper.usersInDb()

    assert(result.body.error.includes('Password must be 3 or more characters in length'))
    assert.strictEqual(usersAtEnd.length, usersAtStart.length)
  })
})

after(async () => {
  await mongoose.connection.close()
})