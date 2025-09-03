import {config} from 'dotenv'

config()
import express from 'express'
import morgan from 'morgan'
import cors from 'cors'

const Person = require('./models/person')
const app = express()
app.use(cors())
app.use(express.json())
app.use(express.static('dist'))

morgan.token('response-body', (request) =>
  JSON.stringify(request.body))
app.use(
  morgan(`:method :url :status :res[content-length] - :response-time ms :response-body`, {
    skip: (request) => request.method !== 'POST'
  })
)

app.get('/api/persons', (_, response) => {
  Person.find({}).then(person => {
    response.json(person)
  })
})

app.get('/api/persons/:id', (request, response, next) => {
  Person.findById(request.params.id)
    .then(person => {
      if (person) {
        response.json(person)
      } else {
        response.status(404).end()
      }
    })
    .catch(error => next(error))
})

app.post('/api/persons', (request, response, next) => {
  const body = request.body

  if (!body.name || !body.number) {
    return response.status(400).json({
      error: 'Content missing'
    })
  }

  const person = new Person({
    name: body.name,
    number: body.number
  })

  person.save()
    .then(savedPerson => response.json(savedPerson))
    .catch(error => next(error))
})

app.put('/api/persons/:id', (request, response, next) => {
  const body = request.body

  if (!body.number) {
    return response.status(400).json({error: 'number missing'})
  }

  Person.findByIdAndUpdate(
    request.params.id,
    {number: body.number},
    {new: true, runValidators: true, context: 'query'}
  )
    .then(updatedPerson => {
      if (updatedPerson) {
        response.json(updatedPerson)
      } else {
        response.status(404).end()
      }
    })
    .catch(error => next(error))
})

app.delete('/api/persons/:id', (request, response, next) => {
  Person.findByIdAndDelete(request.params.id)
    .then(() => {
      response.status(204).end()
    })
    .catch(error => next(error))
})

app.get('/info', (_, response) => {
  const now = new Date().toUTCString()
  Person.find({}).then(person => {
    response.send(`
    <p>Phonebook has info for ${person.length} people</p>
    <p>${now}</p>
    `)
  })
})

const errorHandler = (error, _, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({error: 'malformed id'})
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({error: error.message})
  }
  next(error)
}

app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})