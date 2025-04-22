import React from "react"

function Filter({ nameToFilter, handleNameToFilterChange }) {
    return (
        <>
            <h2>Filter</h2>
            <input
                id="filterInput"
                placeholder="Enter name to filter"
                value={nameToFilter}
                onChange={handleNameToFilterChange}
            />
        </>
    )
}

export default Filter
