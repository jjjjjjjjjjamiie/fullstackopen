import Blog from '../models/blog'
import {Router} from 'express'
import User from '../models/user'

const blogsRouter = Router()

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('user', {username: 1, name: 1})
  response.json(blogs)
})

blogsRouter.post('/', async (request, response) => {
  const users = await User.find({})
  const user = users[0]

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