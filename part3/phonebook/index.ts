require('dotenv').config()
import express from 'express'
import morgan from 'morgan'
import cors from 'cors'

const Person = require('./models/person')
const app = express()
app.use(cors())
app.use(express.json())
app.use(express.static('dist'))

morgan.token('response-body', (request, response) =>
  JSON.stringify(request.body))
app.use(
  morgan(`:method :url :status :res[content-length] - :response-time ms :response-body`, {
    skip: (request, response) => request.method !== 'POST'
  })
)

app.get('/api/persons', (request, response) => {
  Person.find({}).then(person => {
    response.json(person)
  })
});

app.get('/api/persons/:id', (request, response) => {
  const id = request.params.id
  const person = persons.find(p => p.id === id)
  person ?
    response.json(person) :
    response.status(404).end()
})

app.post('/api/persons', (request, response, next) => {
  const body = request.body

  if (!body.name || !body.number) {
    return response.status(400).json({
      error: 'Content missing'
    })
  }

  Person.findOneAndUpdate(
    {name: body.name},
    {number: body.number},
    {new: true, upsert: true}
  )
    .then(person => {
      response.json(person)
    })
    .catch(error => next(error))
})

app.delete('/api/persons/:id', (request, response) => {
  Person.findByIdAndDelete(request.params.id)
    .then(result => {
      response.status(204).end()
    })
    .catch(error => next(error))
})

app.get('/info', (request, response) => {
  let now = new Date().toUTCString();
  response.send(`
    <p>Phonebook has info for ${persons.length} people</p>
    <p>${now}</p>
`)
})

const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({error: 'malformed id'})
  }
  next(error)
}

app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})