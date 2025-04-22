import React from "react"

function AddContact({
    handleNameChange,
    handleNumberChange,
    handleSubmit,
    newName,
    newNumber,
}) {
    return (
        <>
            <h2>Add Contact</h2>
            
            <form onSubmit={handleSubmit}>
                <div>
                    name:
                    <input
                        id="nameInput"
                        placeholder="Enter name of new contact"
                        value={newName}
                        onChange={handleNameChange}
                    />
                </div>
                <div>
                    number:
                    <input
                        id="numberInput"
                        value={newNumber}
                        placeholder="Enter number of new contact"
                        onChange={handleNumberChange}
                    />
                </div>
                <div>
                    <button type="submit" onClick={handleSubmit}>
                        add
                    </button>
                </div>
            </form>
        </>
    )
}

export default AddContact
