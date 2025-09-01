import express from 'express'
import morgan from 'morgan'
import * as process from "node:process";
import cors from 'cors'


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

let persons = [
  {
    "id": "1",
    "name": "Arto Hellas",
    "number": "040-123456"
  },
  {
    "id": "2",
    "name": "Ada Lovelace",
    "number": "39-44-5323523"
  },
  {
    "id": "3",
    "name": "Dan Abramov",
    "number": "12-43-234345"
  },
  {
    "id": "4",
    "name": "Mary Poppendieck",
    "number": "39-23-6423122"
  }
]

app.get('/api/persons', (request, response) => {
  response.json(persons)
});

app.get('/api/persons/:id', (request, response) => {
  const id = request.params.id
  const person = persons.find(p => p.id === id)
  person ?
    response.json(person) :
    response.status(404).end()
})

app.post('/api/persons', (request, response) => {
  const body = request.body

  if (!body.name || !body.number) {
    return response.status(400).json({
      error: 'Content missing'
    })
  }

  if (persons.find(p => p.name === body.name)) {
    return response.status(400).json({
      error: 'Person already exists'
    })
  }

  const person = {
    id: Math.floor(Math.random() * 1000000),
    name: body.name,
    number: body.number,
  }

  persons = persons.concat(person)
  response.json(person)
})

app.delete('/api/persons/:id', (request, response) => {
  const id = request.params.id
  persons = persons.filter(p => p.id !== id)

  response.status(204).end()
})

app.get('/info', (request, response) => {
  let now = new Date().toUTCString();
  response.send(`
    <p>Phonebook has info for ${persons.length} people</p>
    <p>${now}</p>
`)
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})