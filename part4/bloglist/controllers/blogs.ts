import Blog from "../models/blog";
import {Router} from "express";

const blogsRouter = Router()

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({})
  response.json(blogs)
})

blogsRouter.post('/', async (request, response) => {
  const blog = new Blog(request.body)
  const result = await blog.save()
  response.status(201).json(result)
})

blogsRouter.delete('/:id', async (request, response) => {
  let blogToDelete = await Blog.findByIdAndDelete(request.params.id);
  if (!blogToDelete) {
    response.status(404).end()
  }
  
  response.status(204).end()
})

export default blogsRouter