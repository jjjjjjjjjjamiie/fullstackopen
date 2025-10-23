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

    const passwordHash = await bcrypt.hash('sekret', 10)
    const user = new User({username: 'root', passwordHash})

    await user.save()
  })

  test('creation succeeds with a fresh username', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'jjamiie',
      name: 'Jimmy Nuggets',
      password: 'salainen',
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

  after(async () => {
    await mongoose.connection.close()
  })
})
