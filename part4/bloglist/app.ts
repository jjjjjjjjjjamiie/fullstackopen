import express from 'express'
import mongoose from 'mongoose'
import config from './utils/config'
import logger from './utils/logger'
import middleware from './utils/middleware'
import blogsRouter from './controllers/blogs'
import usersRouter from './controllers/users'
import loginRouter from './controllers/login'

const app = express()
app.use(express.json())

logger.info('connecting to', config.MONGODB_URI)

mongoose
  .connect(config.MONGODB_URI)
  .then(() => {
    logger.info('connected to MongoDB')
  })
  .catch(error => {
    logger.error('error connecting to MongoDB:', error.message)
  })

app.use(middleware.requestLogger)
app.use(middleware.tokenExtractor)

app.use('/api/login', loginRouter)
app.use('/api/blogs', blogsRouter)
app.use('/api/users', usersRouter)

app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

export default app