import React, { useState, useEffect } from 'react'
import personService  from './services/persons'
import Filter from "./components/Filter";
import PersonForm from './components/PersonForm';
import Persons from './components/Persons';
import Notification from "./components/Notification";

//Ohjelma jolla voidaan tallentaa henkilöiden puhelinnumeroita ja filtteröidä nimen perusteella näytettäviä
const App = () => {
  const [ persons, setPersons ] = useState([]) 
  const [ newName, setNewName ] = useState('')
  const [ newNumber, setNewNumber ] = useState('')
  const [ filter, setFilter ] = useState("")
  const [ notification, setNotification ] = useState(null)
  const [ notificationType, setNotificationType ] = useState(null)

  //Alkutilan hakeminen ja virhe ilmoitus, jos jotain menee pieleen
  useEffect(() => {
    personService      
    .getAll()      
    .then(initialPersons => {
      setPersons(initialPersons)
  })
}, [])

  //Logataan ja nimen vaihdon kutsu
  const handleNameChange = (event) => {    
    //console.log(event.target.value)    
    setNewName(event.target.value)
  }

  //Logataan ja hoidetaan numeron vaihdon kutsu
    const handleNumberChange = (event) => {
      //console.log(event.target.value) 
      setNewNumber(event.target.value)
  }
  
  //Käsitellään käyttäjän syöttämän filtterin muutos
  const handleFilterChange = (event) => {
    setFilter(event.target.value)
  }

  /*
  //Lisätään uusi ihminen tietoineen
  const addPerson = (event) => {    
    event.preventDefault()    
    //console.log('button clicked', event.target) 
    const personObject = {
      //id: persons.length + 1, //TÄMÄ PITÄÄ MUUTTAA JOKSIKIN MUUKSI KOSKA JOS VÄLISTÄ POISTAA TULEE VIRHE
      name: newName,
      number: newNumber,
      id: persons.length + 1
    }

    //Tarkastetaan että nimi ei ole tyhjä
    if (newName !== '' && newNumber !== '') {       
      //Tarkastetaan onko nimi jo puhelinluettelossa, tarkastetaan pienillä kirjaimilla joten fontilla ei väliä
      if (persons.find(person => person.name === newName.toLowerCase())){
        //console.log("Tää nimihän löyty")
        //window.alert(newName, " is already added to phonebook, pleace change the name")
        setNotificationType('error')
        setNotification(`${newName} is already added to phonebook pleace change the name`)
        
        const id = persons.find((person) => {
          return person.name === personObject.name;
        }).id;

        if(window.confirm(`${newName} is already added to phonebook, do you want to change the number?`)){
          personService
            .update(id, personObject)
            .then(returnedPerson => {        
              setPersons(persons.map(person => person.id !== id ? person : returnedPerson))
              
              setNotificationType('confirmation')
              setNotification(`Information of ${newName} has been updated succesfully`)
            })
            .catch(error => {      
              alert(        
                `${newName} was already added to server in another session`      
                )      
                setPersons(persons.filter(person => person.id !== id))    
            })
        }
        else {
          setNotificationType('error')
          setNotification(`Information of ${newName} has been updated in another session`)
          setPersons(persons.filter(person => person.id !== id))
        }
      }

      //Jos nimi ei ole luettelossa lisätään normaalisti luetteloon
      else{
        //Täällä luodaan uusi nimi ja tallennetaan annettu data db.json tiedostoon
        personService    
          .create(personObject)    
          .then(returnedPerson => {      
            setPersons(persons.concat(returnedPerson))
            //console.log("New person and number saved", response)  
            setNotificationType('confirmation')
            setNotification(`Added ${newName}`)
          })
          .catch(error => {      
            alert(        
              `${newName} changes have been made by other session`      
              )      
              //setPersons(persons.filter(person => person.id !== id))    
          })
      }
      setNewName('')
      setNewNumber('')
    }

    //Jos käyttäjä yrittää tallentaa tyhjää nimeä luetteloon tulee virhe
    else {
      //window.alert(`The name or number can't be empty`)
      setNotificationType('error')
      setNotification(`The name or number can't be empty`)
      //Tällä saadaan yllä oleva viesti katoamaan 5 sekunnin jälkeen

    }
    //Tällä voidaan asettaa viive, jonka jälkeen viestit hävitetään
    setTimeout(() => {
      setNotification(null)
      setNotificationType('error')
    }, 5000)
  }

*/

//Uudelleen tehty pieni versio note esimerkin mukaisesti.
const addPerson = (event) => {
  event.preventDefault()
  const personObject = {
    name: newName,
    number: newNumber,
    id: persons.length + 1
  }

  personService
    .create(personObject)
    .then(returnedPerson => {
      setPersons(persons.concat(returnedPerson))
      setNewName('')
      setNewNumber('')
    })
}



  //Poistetaan haluttu yhteystieto puhelinluettelosta toimii eventillä mutta ei id:llä jostain syystä
  const deletePerson = (id, name) => {
    if(window.confirm(`Do you want to delete ${name}?`)){
      personService
        .deletePerson(id)
        .then(() =>  {
          setPersons(persons.filter(person => person.id !== id) )
          console.log("Poistettiin onnistuneesti ", name)
          setNotificationType('confirmation')
          setNotification(`Information of ${name} has been removed from the server`)
        })
        .catch(error => {      
          alert(        
            `${name} was already deleted from server`      
            )      
            setPersons(persons.filter(person => person.id !== id))    
        })
    }
    //Tällä voidaan asettaa viive, jonka jälkeen viestit hävitetään
    setTimeout(() => {
      setNotification(null)
      setNotificationType('error')
    }, 5000)
  }

  //Täällä haetaan tulostettavia tietoja ja lähetetään otsikot printattaviksi
  return (
    <div>
      <h2>Phonebook</h2>

      <Filter 
        value={filter} 
        onChange={handleFilterChange} 
      />

      <Notification notification={notification} notificationType={notificationType} />

      <h2>Add a new Person and number</h2>

      <PersonForm
          newName = {newName}
          newNumber = {newNumber}
          addPerson = {addPerson}
          handleNameChange = {handleNameChange}
          handleNumberChange = {handleNumberChange}
      />

      <h2>Names and numbers</h2>
        <Persons
          filter = {filter} 
          persons = {persons}
          deletePerson = {deletePerson}
        />
    </div>
  )
}

export default App