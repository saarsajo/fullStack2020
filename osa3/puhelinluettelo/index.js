//Node.js versio puhelinluettelosta
//expressiä kutsumalla luodaan muuttujaan app sijoitettava express-sovellusta vastaava olio
const express = require('express')
const app = express()
const morgan = require('morgan')

app.use(express.json()) 

//Tarkastaa Express GET-tyyppisten HTTP-pyyntöjen yhteydessä ensin löytyykö pyynnön polkua 
//vastaavan nimistä tiedostoa hakemistosta build. Jos löytyy, palauttaa express tiedoston.
app.use(express.static('build'))

//Sallitaan muista origineista tulevat pyynnöt käyttämällä Noden cors-middlewarea.
//Eli voidaan esim siirtää dataa portin 3000 ja 3001 välillä
const cors = require('cors')

app.use(cors())

//En ihan vielä ymmärrä MORGANIA
//morgan.token('post', (request, response) => JSON.stringify(request.body))

app.use(morgan('tiny'))

/* TÄTÄ EI EHKÄ TARVITA JOS MORGAN HOITAA HOMMAN ?
//Middleware, joka tulostaa konsoliin palvelimelle tulevien pyyntöjen perustietoja.
const requestLogger = (request, response, next) => {
  console.log('Method:', request.method)
  console.log('Path:  ', request.path)
  console.log('Body:  ', request.body)
  console.log('---')
  next()
}

//Middleware, jonka ansiosta saadaan routejen käsittelemättömistä virhetilanteista 
//JSON-muotoinen virheilmoitus:
const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

app.use(requestLogger)
*/


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


//Seuraavaksi määritellään sovellukselle kaksi routea. 
//Ensimmäinen määrittelee tapahtumankäsittelijän, joka hoitaa sovelluksen juureen 
//eli polkuun / tulevia HTTP GET -pyyntöjä:
app.get('/', (request, response) => {
    response.send('<h1>Puhelinluettelo</h1>')
  })
  
  //Haetaan puhelinluettelon tiedot ja tulostetaan /persons sivulle
  app.get('/api/persons', (request, response) => {
    response.json(persons)
  })

  //Täällä haetaan aikatiedot ja tulostetaan /info sivulle
  app.get('/info', (request, response) => {
    response.json(info)
  })
  
  //Määritetään käytettävä portti ja kuunnellaan sieltä tulevia syötteitä
  //PORT määritelty portti tai 3001, jos ympäristömuuttuja PORT ei ole määritelty. 
  const PORT = process.env.PORT || 3001
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
  })

  //käsittelee kaikki HTTP GET -pyynnöt, jotka ovat muotoa /api/persons/JOTAIN, 
  //missä JOTAIN on mielivaltainen merkkijono, joka kuvastaa id:tä
app.get('/api/persons/:id', (request, response) => {
  // Muuteteaan parametrina oleva merkkijonomuotoinen id numeroksi:
  const id = Number(request.params.id)
  const person = persons.find(person => person.id === id)
  if (person) {    
    response.json(person)  
  } 
  else {    
    response.status(404).end()
  }})

// Poisto tapahtuu tekemällä HTTP DELETE -pyyntö resurssin urliin:
app.delete('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  persons = persons.filter(person => person.id !== id)

  response.status(204).end()
})

  //Luodaan persons id
  const generateId = () => {
    return Math.floor(Math.random() * Math.floor(99999999999));
  }

//Postataan uusi henkilö
app.post('/api/persons', (request, response) => {
  const body = request.body

  //Jos vastaanotetulta datalta puuttuu sisältö kentästä name, vastataan statuskoodilla 400 bad request:
  if (body.name !=='' && body.number !=='') {

    //Määritellään mistä person koostuu
    const person = {
      id: generateId(),
      name: body.name,
      number: body.number
    }

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
  }

  //TUlostetaan virheilmoitus
  else{
    return response.status(400).json({ 
      error: 'Name or number missing' 
    })
  }
})

/* TÄTÄ EI EHKÄ TARVITA JOS MORGANIA TEHDÄÄN ????
app.use(unknownEndpoint)
*/