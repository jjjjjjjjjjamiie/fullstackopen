import Blog from '../models/blog'
import {Router} from 'express'
import User from '../models/user'
import jwt from 'jsonwebtoken'

const blogsRouter = Router()

const getTokenFrom = request => {
  const authorization = request.get('authorization')
  if (authorization && authorization.startsWith('Bearer ')) {
    return authorization.replace('Bearer ', '')
  }
  return null
}

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('user', {username: 1, name: 1})
  response.json(blogs)
})

blogsRouter.post('/', async (request, response) => {
  const decodedToken = jwt.verify(getTokenFrom(request), process.env.SECRET)
  if (!decodedToken.id) {
    return response.status(401).json({error: 'token invalid'})
  }
  const user = await User.findById(decodedToken.id)

  if (!user) {
    return response.status(400).json({error: 'User ID missing or invalid'})
  }

  const blog = new Blog({
    ...request.body,
    user: user._id,
  })

  const result = await blog.save()
  user.blogs = user.blogs.concat(result._id)
  await user.save()

  response.status(201).json(result)
})

blogsRouter.delete('/:id', async (request, response) => {
  let blogToDelete = await Blog.findByIdAndDelete(request.params.id);

  if (!blogToDelete) {
    response.status(404).end()
  }

  response.status(204).end()
})

blogsRouter.put('/:id', async (request, response) => {
  const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, request.body)

  if (!updatedBlog) {
    response.status(404).end()
  }

  response.status(200).end()
})

export default blogsRouter