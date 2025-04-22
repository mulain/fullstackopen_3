import axios from "axios"

const api = axios.create({
    baseURL: import.meta.env.VITE_BACKEND_URL,
})

const getAllContacts = () => {
    const request = api.get("persons")
    return request
        .then((response) => response.data)
        .catch((error) => {
            console.error("Error fetching contacts:", error)
            throw error
        })
}

const addContact = (newContact) => {
    const request = api.post("persons", newContact)
    return request
        .then((response) => response.data)
        .catch((error) => {
            console.error("Error adding contact:", error)
            throw error
        })
}

const deleteContact = (id) => {
    const request = api.delete(`persons/${id}`)
    return request
        .then((response) => response.data)
        .catch((error) => {
            console.error("Error deleting contact:", error)
            throw error
        })
}

const updateContact = (id, updatedContact) => {
    const request = api.put(`persons/${id}`, updatedContact)
    return request
        .then((response) => response.data)
        .catch((error) => {
            console.error("Error updating contact:", error)
            throw error
        })
}

export default {
    getAllContacts,
    addContact,
    deleteContact,
    updateContact,
}
