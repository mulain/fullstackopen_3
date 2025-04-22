import { useState, useEffect } from "react"
import AddContact from "./components/AddContact"
import Contacts from "./components/Contacts"
import Filter from "./components/Filter"
import Notification from "./components/Notification"
import contactService from "./services/contactService"
import "./index.css"

const App = () => {
    const [contacts, setContacts] = useState([])
    const [newName, setNewName] = useState("")
    const [newNumber, setNewNumber] = useState("")
    const [nameToFilter, setNameToFilter] = useState("")
    const [notification, setNotification] = useState(null)

    const handleGetContacts = () => {
        contactService
            .getAllContacts()
            // .then((initialContacts) => {
            //     setContacts(initialContacts)
            // })
            .then((data) => {
                setContacts(data)
            }) // works, because setPersons takes one argument
            .catch((error) => {
                console.error("Error fetching contacts:", error)
            })
    }

    useEffect(() => {
        handleGetContacts()
    }, [])

    const handleNameChange = (event) => {
        setNewName(event.target.value)
    }

    const handleNumberChange = (event) => {
        setNewNumber(event.target.value)
    }

    const handleNameToFilterChange = (event) => {
        setNameToFilter(event.target.value)
    }

    const handleNotify = (message, type) => {
        setNotification({ message, type })
        setTimeout(() => {
            setNotification(null)
        }, 2000)
    }

    const handleUpdateContact = () => {
        if (
            window.confirm(
                `${newName} is already added to phonebook, replace the old number with a new one?`
            )
        ) {
            const contactToUpdate = contacts.find((contact) => contact.name === newName)
            const updatedContact = { ...contactToUpdate, number: newNumber }
            contactService
                .updateContact(contactToUpdate.id, updatedContact)
                .then((returnedContact) => {
                    setContacts(
                        contacts.map((contact) =>
                            contact.id !== contactToUpdate.id ? contact : returnedContact
                        )
                    )
                    handleNotify(`Updated contact "${returnedContact.name}"`, "success")
                })
                .catch((error) => {
                    handleNotify(
                        `Error updating contact "${contactToUpdate.name}": ${error.response.data.error}`,
                        "error"
                    )
                    handleGetContacts()
                })
        }
    }

    const handleAddContact = () => {
        contactService
            .addContact({
                name: newName,
                number: newNumber,
            })
            .then((returnedContact) => {
                setContacts(contacts.concat(returnedContact))
                handleNotify(`Added contact "${returnedContact.name}"`, "success")
            })
            .catch((error) => {
                handleNotify(`Error adding contact "${newName}": ${error.response.data.error}`, "error")
                handleGetContacts()
            })
    }

    const handleSubmit = (event) => {
        event.preventDefault()
        if (newName === "") {
            handleNotify("Name cannot be empty", "error")
            return
        }
        if (contacts.some((contact) => contact.name === newName)) {
            handleUpdateContact()
        } else {
            handleAddContact()
        }
        setNewName("")
        setNewNumber("")
    }

    const handleDelete = (contact) => {
        if (window.confirm(`Delete contact ${contact.name} with id ${contact.id}?`)) {
            contactService
                .deleteContact(contact.id)
                .then(() => {
                    setContacts(contacts.filter((c) => c.id !== contact.id))
                    handleNotify(`Deleted contact "${contact.name}"`, "success")
                })
                .catch((error) => {
                    handleNotify(`Error deleting contact "${contact.name}": ${error.response.data.error}`, "error")
                    handleGetContacts()
                })
        }
    }

    return (
        <>
            <h1>Phonebook</h1>

            <Notification notification={notification} />

            <Filter
                nameToFilter={nameToFilter}
                handleNameToFilterChange={handleNameToFilterChange}
            />

            <AddContact
                handleNameChange={handleNameChange}
                handleNumberChange={handleNumberChange}
                handleSubmit={handleSubmit}
                newName={newName}
                newNumber={newNumber}
            />

            <Contacts
                contacts={contacts}
                nameToFilter={nameToFilter}
                handleDelete={handleDelete}
            />
        </>
    )
}

export default App
