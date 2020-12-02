import React from 'react'
import Person from './Person'

//Lähettää kaikki puhelinluettelon henkilöt numeroineen ETSI keino laittaa samalle riville ilman virheitä
const Persons = ({ filter, persons, deletePerson }) => {

    return (
        //Vertaa käyttäjän syöttämää filtteriä olemassa oleviin nimiin, huomioimatta isoja ja pieniä kirjaimia
        //Antaa eteenpäin näytettävät nimet filtteröitynä
        persons.filter(person =>
            person.name.includes(filter.toLowerCase())).map(person =>
        <span key={person.id}>
            <Person 
                name={person.name} 
                number={person.number} 
            />
            <button 
                onClick={() => deletePerson(person.id, person.name)}>
                Delete
            </button>
        </span>
        )
    )
}

export default Persons