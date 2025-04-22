import React from "react"

function Contacts({ contacts, nameToFilter, handleDelete }) {
    const filteredContacts = contacts.filter((contact) =>
        contact.name.toLowerCase().includes(nameToFilter.toLowerCase())
    )

    return (
        <>
            <h2>Contacts</h2>
            <table>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Number</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredContacts.map((contact) => (
                        <tr key={contact.name}>
                            <td>{contact.name}</td>
                            <td>{contact.number}</td>
                            <td>
                                <button onClick={() => handleDelete(contact)}>
                                    Delete
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </>
    )
}

export default Contacts
