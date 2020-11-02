import React from 'react'

//Täällä palautetaan käyttäjän syöttämät tiedot ja annetaan niitä eteenpäin
const PersonForm = ({newName, newNumber, addPerson, handleNameChange, handleNumberChange }) => 
<div>  
    <form onSubmit={addPerson}>
        <div>
        Name:
        <input
            value={newName}
            onChange={handleNameChange}
        />
        </div>
        <div>
        Number:
        <input
            value={newNumber}
            onChange={handleNumberChange}
        />
        </div>
        <div>
            <button
                type="submit">Add
            </button>
        </div>
    </form>
</div>

export default PersonForm