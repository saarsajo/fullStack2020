require('dotenv').config()
//Node.js versio puhelinluettelosta
//expressiä kutsumalla luodaan muuttujaan app sijoitettava express-sovellusta vastaava olio
const express = require('express')
const app = express()
const morgan = require('morgan')
//Sallitaan muista origineista tulevat pyynnöt käyttämällä Noden cors-middlewarea.
//Eli voidaan esim siirtää dataa portin 3000 ja 3001 välillä
const cors = require('cors')
const Person = require('./models/person')

app.use(express.json()) 
app.use(cors())

//Tarkastaa Express GET-tyyppisten HTTP-pyyntöjen yhteydessä ensin löytyykö pyynnön polkua 
//vastaavan nimistä tiedostoa hakemistosta build. Jos löytyy, palauttaa express tiedoston.
app.use(express.static('build'))

app.use(morgan('tiny'))


let persons = [
    {
        id : 1,
        name: "Arto Hellas",
        number: "040-123456"
    },
    {
        id : 2,
        name: "Ada",
        number: "040-987654"
    },
    {
        id : 3,
        name: "Dan",
        number: "040-456123"
    },
    {
        id : 4,
        name: "Mary",
        number: "040-654328"
    },
    {
      id : 5,
      name: "Josh",
      number: "040-654211"
  }
]

//Info sivun aikaan liittyvät määrrittelyt
let dateObject = new Date();
// Tämän hetkisen ajan määrittäminen ja esitetään yksi numeroiset ajan määreet muodossa "0 + numero"
let day = ("0" + dateObject.getDate()).slice(-2);
// Kuukausien määrittäminen
let month = ("0" + (dateObject.getMonth())).slice(-2);
// Vuosien
let year = dateObject.getFullYear();
// Tuntien
let hours = dateObject.getHours();
// Minuuttien
let minutes = dateObject.getMinutes();
// Sekunttien
let seconds = dateObject.getSeconds();
//Yhdistetään kaikki aikatiedot
const timeAndDate = new Date(Date.UTC(year, month, day, hours, minutes, seconds));
let info = `Phonebook has info for ${persons.length} people. ${timeAndDate.toUTCString()}`;


//Määritellään sovellukselle kaksi routea. 
//Ensimmäinen määrittelee tapahtumankäsittelijän, joka hoitaa sovelluksen juureen 
//eli polkuun / tulevia HTTP GET -pyyntöjä:

    /*
  //Haetaan puhelinluettelon tiedot ja tulostetaan /persons sivulle
  app.get('/api/persons', (request, response) => {
    response.json(persons)
  })

*/


//Haetaan puhelinluettelon tiedot ja tulostetaan /persons sivulle
//Tämän laittamisen jälkeen jotain ongelmia!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
  app.get('/api/persons', (request, response) => {
    Person.find({}).then(people => {
      response.json(people.map(person => person.toJSON()))
    })
  })

  //Täällä haetaan aikatiedot ja tulostetaan /info sivulle
  app.get('/info', (request, response) => {
    response.json(info)
  })

//Luodaan personille randomi id
const generateId = () => {
  return Math.floor(Math.random() * Math.floor(99999999999));
}

//Lisätään uusi henkilö tietokantaan
app.post('/api/persons', (request, response) => {
  const body = request.body

//Ei ressata tästä nyt
  /*
  //Jos vastaanotetulta datalta puuttuu sisältö kentästä name, vastataan statuskoodilla 400 bad request:
  if (body.content === undefined) {
      //Tulostetaan virheilmoitus
      return response.status(400).json({ 
        error: 'Name or number missing' 
      })
    }
*/
    //Luodaan uusi person
    const person = new Person({
      name: body.name,
      number: body.number
    })

    //Tallennetaan nimi tietokantaan
    person.save().then(savedPerson => {
      response.json(savedPerson.toJSON())
    })

    /* EI VÄLITETÄ TÄSTÄ ATM
    //system.log("Ensin ", persons, " Sitten ", person, " person.name on ", person.name )
    //Tarkastetaan että nimi ei ole vielä listalla
    if (persons.find(person => person.name.toLowerCase() === body.name.toLowerCase())){
      return response.status(400).json({ 
        error: 'name must be unique' 
      }) 
    }
    else{
      //Lisätään uusi nimi kantaan
      persons = persons.concat(person)
      response.json(person)
    }
  */
})

//käsittelee kaikki HTTP GET -pyynnöt, jotka ovat muotoa /api/persons/JOTAIN, 
//missä JOTAIN on mielivaltainen merkkijono, joka kuvastaa id:tä
app.get('/api/persons/:id', (request, response) => {
  Person.findById(request.params.id).then(person => {
    response.json(person.toJSON())
  })
})


// Poisto tapahtuu tekemällä HTTP DELETE -pyyntö resurssin urliin:
app.delete('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  persons = persons.filter(person => person.id !== id)

  response.status(204).end()
})

//Haetaan envistä käytettävä portti
const PORT = process.env.PORT

//Määritetään käytettävä portti ja kuunnellaan sieltä tulevia syötteitä
//PORT määritelty portti tai 3001, jos ympäristömuuttuja PORT ei ole määritelty. 
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})