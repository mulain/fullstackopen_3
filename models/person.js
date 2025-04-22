const mongoose = require("mongoose")
const { type } = require("os")

mongoose.set("strictQuery", false)

const url = process.env.MONGODB_URI

mongoose
    .connect(url)
    .then(() => {
        console.log("Connected to MongoDB")
    })
    .catch((error) => {
        console.error("Error connecting to MongoDB:", error.message)
    })

const personSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            unique: true,
            minlength: 3,
        },
        number: {
            type: String,
            required: true,
            unique: false,
            minlength: 8,
            validate: {
                validator: function (v) {
                    return /\d{2,3}-\d+/.test(v)
                },
                message: (props) => `${props.value} is not a valid phone number, must have format xx-x... or xxx-x...`,
            },
        }
    },
    {
        toJSON: {
            transform: (document, returnedObject) => {
                returnedObject.id = returnedObject._id.toString()
                delete returnedObject._id
                delete returnedObject.__v
            },
        },
    }
)

module.exports = mongoose.model("Person", personSchema)
