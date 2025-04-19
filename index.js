const express = require("express")
const morgan = require("morgan")
const cors = require("cors")

const app = express()

const persons = [
    {
        id: "1",
        name: "Arto Hellas",
        number: "040-123456",
    },
    {
        id: "2",
        name: "Ada Lovelace",
        number: "39-44-5323523",
    },
    {
        id: "3",
        name: "Dan Abramov",
        number: "12-43-234345",
    },
    {
        id: "4",
        name: "Mary Poppendieck",
        number: "39-23-6423122",
    },
    {
        id: "5",
        name: "John Doe Pupoe",
        number: "12-34-567890",
    },
    {
        id: "6",
        name: "Jane Smith",
        number: "98-76-543210",
    },
]

// Logging
morgan.token("body", (req, res) => {
    return JSON.stringify(req.body) || "No body"
})

const logger = morgan(
    ":method :url :status :res[content-length] - :response-time ms :body"
)

// Middleware
app.use(logger)
app.use(express.json())
app.use(cors())

// Routes

app.get("/", (req, res) => {
    res.send("Hello World")
})

app.get("/api/persons", (req, res) => {
    res.json(persons)
})

app.get("/api/persons/:id", (req, res) => {
    const id = req.params.id
    const person = persons.find((p) => p.id === id)
    if (person) {
        res.json(person)
    } else {
        res.status(404).send("Person not found")
    }
})

app.get("/info", (req, res) => {
    phonebookLength = persons.length
    infoString = `Phonebook has info for ${phonebookLength} people`
    date = new Date()
    res.send(
        `<p>${infoString}</p>
        <p>${date}</p>`
    )
})

app.delete("/api/persons/:id", (req, res) => {
    const id = req.params.id
    const personIndex = persons.findIndex((p) => p.id === id)
    if (personIndex !== -1) {
        persons.splice(personIndex, 1)
        res.status(204).end()
    } else {
        res.status(404).send("Person not found")
    }
})

app.post("/api/persons", (req, res) => {
    const { name, number } = req.body

    if (!name || !number) {
        return res.status(400).json({ error: "Name and number are required" })
    }

    const existingPerson = persons.find((p) => p.name === name)
    if (existingPerson) {
        return res.status(400).json({ error: "Name must be unique" })
    }

    const newPerson = {
        name: name,
        number: number,
        id: Math.floor(Math.random() * 1000).toString(),
    }

    persons.push(newPerson)
    res.status(201).json(newPerson)
})

const unknownEndpoint = (req, res) => {
    res.status(404).send({ error: "unknown endpoint" })
}

app.use(unknownEndpoint)

app.listen(3001, () => {
    console.log("Server is running on port 3001")
})
