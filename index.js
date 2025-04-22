const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
require('dotenv').config()
const Person = require('./models/person')

const app = express()

// Logging
morgan.token('body', (req) => {
  return JSON.stringify(req.body) || 'No body'
})

const logger = morgan(
  ':method :url :status :res[content-length] - :response-time ms :body'
)

// Middleware
app.use(logger)
app.use(express.json())
app.use(cors())
app.use(express.static('dist'))

// Routes

app.get('/', (req, res) => {
  res.send('Hello World')
})

app.get('/api/persons', (req, res, next) => {
  Person.find({})
    .then((result) => {
      const fetchedPersons = result.map((person) => person.toJSON())
      res.json(fetchedPersons)
    })
    .catch((error) => {
      error.context = 'Error fetching persons'
      next(error)
    })
})

app.get('/api/persons/:id', (req, res, next) => {
  const id = req.params.id
  Person.findById(id)
    .then((person) => {
      if (person) {
        res.json(person.toJSON())
      } else {
        res.status(404).send('Person not found')
      }
    })
    .catch((error) => {
      error.context = 'Error fetching person by ID'
      next(error)
    })
})

app.get('/info', (req, res, next) => {
  Person.countDocuments({})
    .then((phonebookLength) => {
      const infoString = `Phonebook has info for ${phonebookLength} people`
      const date = new Date()
      res.send(`<p>${infoString}</p><p>${date}</p>`)
    })
    .catch((error) => {
      error.context = 'Error fetching phonebook length'
      next(error)
    })
})

app.delete('/api/persons/:id', (req, res, next) => {
  const id = req.params.id

  Person.findByIdAndDelete(id)
    .then((deletedPerson) => {
      if (!deletedPerson) {
        return res.status(404).send('Person not found')
      }
      res.status(204).end()
    })
    .catch((error) => {
      error.context = 'Error deleting person'
      next(error)
    })
})

app.put('/api/persons/:id', (req, res, next) => {
  const id = req.params.id
  const { name, number } = req.body

  if (!name) {
    return res.status(400).json({ error: 'Name is required (number may be empty)' })
  }

  const personToUpdate = { name, number }

  Person.findByIdAndUpdate(id, personToUpdate, {
    new: true,
    runValidators: true,
    context: 'query',
  })
    .then((updatedPerson) => {
      if (!updatedPerson) {
        return res.status(404).send('Person not found')
      }
      res.json(updatedPerson.toJSON())
    })
    .catch((error) => {
      error.context = 'Error updating person'
      next(error)
    })
})

app.post('/api/persons', (req, res, next) => {
  const { name, number } = req.body

  if (!name || !number) {
    return res.status(400).json({ error: 'Name and number are required' })
  }

  const person = new Person({ name, number })

  person
    .save()
    .then((savedPerson) => {
      res.status(201).json(savedPerson)
    })
    .catch((error) => {
      error.context = 'Error creating person'
      next(error)
    })
})

const unknownEndpoint = (req, res) => {
  res.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)

const errorHandler = (error, req, res) => {
  console.error(error.message)
  if (error.context) {
    console.error(`Context: ${error.context}`)
  }

  if (error.name === 'CastError') {
    return res.status(400).send({ error: 'malformatted id' })
  }

  if (error.name === 'ValidationError') {
    return res.status(400).json({ error: error.message })
  }

  res.status(500).json({ error: 'Internal server error' })
}

app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
