const mongoose = require('mongoose')
require('dotenv').config()

const password = process.argv[2]
const name = process.argv[3]
const number = process.argv[4]

if (!password) {
  console.log('Please provide the password as an argument: node mongo.js <password>')
  process.exit(1)
}

const url = `mongodb+srv://wolfmardin:${password}@cluster0.6eypaxd.mongodb.net/phonebook?retryWrites=true&w=majority&appName=Cluster0`
const mongodbUrl = process.env.MONGODB_URI
console.log('Connecting to', mongodbUrl)

mongoose.set('strictQuery', false)
mongoose.connect(url)

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
})

const Person = mongoose.model('Person', personSchema)

if (process.argv.length === 3  ) {
  Person.find({})
    .then((result) => {
      console.log('phonebook:')
      result.forEach((person) => {
        console.log(person.name, person.number)
      })
    })
    .catch((err) => {
      console.error('Error fetching persons:', err)
    })
    .finally(() => {
      mongoose.connection.close().then(() => process.exit(0))
    })
} else if (name && number) {
  const person = new Person({ name, number })

  person
    .save()
    .then(() => {
      console.log(`added ${name} number ${number} to phonebook`)
      mongoose.connection.close().then(() => process.exit(0))
    })
    .catch((err) => {
      console.error('Error saving person:', err)
    })
    .finally(() => {
      mongoose.connection.close().then(() => process.exit(0))
    })
} else {
  console.log('Name and number are required')
  mongoose.connection.close().then(() => process.exit(1))
}
