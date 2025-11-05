import Blog from '../models/blog'
import {Router} from 'express'
import {userExtractor} from '../utils/middleware'

const blogsRouter = Router()

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('user', {username: 1, name: 1})
  response.json(blogs)
})

blogsRouter.post('/', userExtractor, async (request, response) => {
  const user = request.user
  const blog = new Blog({
    ...request.body,
    user: user._id,
  })

  const result = await blog.save()
  user.blogs = user.blogs.concat(result._id)
  await user.save()

  response.status(201).json(result)
})

blogsRouter.delete('/:id', userExtractor, async (request, response) => {
  const user = request.user

  const blog = await Blog.findById(request.params.id)

  if (!blog) {
    return response.status(404).json({error: 'no blog found'})
  }

  if (blog.user.toString() !== user.id) {
    return response.status(401).json({error: 'user invalid'})
  }

  await blog.deleteOne()
  response.status(204).end()
})

blogsRouter.put('/:id', userExtractor, async (request, response) => {
  const updatedBlog = await Blog.findByIdAndUpdate(
    request.params.id,
    request.body,
    {new: true, runValidators: true}
  )

  if (!updatedBlog) {
    return response.status(404).end()
  }

  response.status(200).json(updatedBlog)
})

export default blogsRouter