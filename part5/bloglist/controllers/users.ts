import bcrypt from 'bcrypt'
import User from '../models/user'
import {Router} from 'express'

const usersRouter = Router()

usersRouter.get('/', async (request, response) => {
  const users = await User.find({}).populate('blogs', {url: 1, title: 1, author: 1})
  response.json(users)
})

usersRouter.post('/', async (request, response) => {
  const {username, name, password} = request.body

  if (password.length < 3) {
    return response
      .status(400)
      .json({error: 'Password must be 3 or more characters in length'})
  }
  const saltRounds = 10
  const passwordHash = await bcrypt.hash(password, saltRounds)

  const user = new User({
    username,
    name,
    passwordHash,
  })

  const savedUser = await user.save()

  response.status(201).json(savedUser)
})

export default usersRouter