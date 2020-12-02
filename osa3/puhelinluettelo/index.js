//Node.js versio puhelinluettelosta
//expressiä kutsumalla luodaan muuttujaan app sijoitettava express-sovellusta vastaava olio
const express = require('express')
const morgan = require('morgan')
const app = express()
require('dotenv').config()
const bodyParser = require('body-parser')
//Sallitaan muista origineista tulevat pyynnöt käyttämällä Noden cors-middlewarea.
//Eli voidaan esim siirtää dataa portin 3000 ja 3001 välillä
const cors = require('cors')
const Person = require('./models/person')


app.use(bodyParser.json())
app.use(cors())
app.use(express.json()) 
//Tarkastaa Express GET-tyyppisten HTTP-pyyntöjen yhteydessä ensin löytyykö pyynnön polkua 
//vastaavan nimistä tiedostoa hakemistosta build. Jos löytyy, palauttaa express tiedoston.
app.use(express.static('build'))
app.use(morgan('tiny'))

//Haetaan puhelinluettelon tiedot ja tulostetaan /persons sivulle
//Tämän laittamisen jälkeen jotain ongelmia!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
app.get('/api/persons', (request, response) => {
  Person.find({}).then(people => {
    response.json(people.map(person => person.toJSON()))
  })
})

//Täällä haetaan aikatiedot ja tulostetaan /info sivulle
app.get('/info', (req, res) => {
  Person.find({})
    .then(persons => {
      res.send(`<p>The phonebook has info for ${persons.length} people</p><p>${new Date()}</p>`)
    })
})

//Lisätään uusi henkilö tietokantaan
app.post('/api/persons', (request, response, next) => {
  const body = request.body
  //console.log("Bodyn sisältö on ", body)
  //console.log("Bodyn nimi on ", body.name)
  //console.log("Body length is ", body.name.length)

  //Luodaan uusi henkilö puhelinnumeroineen
  const person = new Person({
    name: body.name,
    number: body.number
  })

  //Tallennetaan nimi tietokantaan
  person
    .save()
    .then(savedPerson => {      
      return savedPerson.toJSON()    
    })    
    .then(savedAndFormattedPerson => {      
      response.json(savedAndFormattedPerson)    
    }) 
    .catch(error => next(error))    
  
/*
    //Jos lisättävä on tyhjä tulostetaan virhe
    if (body.name === undefined || body.number === undefined) {
      return response.status(400).json({ error: 'content missing' })
    }
  
    if (body.name.length < 3 || body.number.length < 8){
      return response.status(400).json({ error: 'Too short name or number. Name must be at least 3 characters and the number must be 8.' })
    }
      else {
        //Luodaan uusi henkilö puhelinnumeroineen
        const person = new Person({
          name: body.name,
          number: body.number
        })

        //Tallennetaan nimi tietokantaan
        person
          .save()
          .then(savedPerson => {      
            return savedPerson.toJSON()    
          })    
          .then(savedAndFormattedPerson => {      
            response.json(savedAndFormattedPerson)    
          }) 
          .catch(error => next(error))    
    }
*/
})

//käsittelee kaikki HTTP GET -pyynnöt, jotka ovat muotoa /api/persons/JOTAIN, 
//missä JOTAIN on mielivaltainen merkkijono, joka kuvastaa id:tä
app.get('/api/persons/:id', (request, response, next) => {
  Person.findById(request.params.id)
  .then(person => {
    if (person) {        
      response.json(person.toJSON())
    } else {        
      response.status(404).end()      
    }    
  })
  .catch(error => next(error))  
})

// Poistetaan id:n mukaan haluttu henkilö numeroineen:
app.delete('/api/persons/:id', (request, response, next) => {
  Person.findByIdAndRemove(request.params.id)
    .then(result => {
      response.status(204).end()
    })
    .catch(error => next(error))
})

//Muistiinpanon tärkeyden muuttamisen mahdollistava olemassaolevan muistiinpanon päivitys 
//onnistuu helposti metodilla findByIdAndUpdate.
app.put('/api/persons/:id', (request, response, next) => {
  const body = request.body

  const person = {
    name: body.name,
    number: body.number
  }

  Person.findByIdAndUpdate(request.params.id, person, { new: true })
    .then(updatedPerson => {
      response.json(updatedPerson.toJSON)
    })
    .catch(error => next(error))
})

//Virheenkäsittelijä tilanteessa, jossa endpointiin ei saada yhteyttä
const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

// olemattomien osoitteiden käsittely
app.use(unknownEndpoint)


//Virheiden käsittelijä handleri
const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError' && error.kind == 'ObjectId') {
    return response.status(400).send({ error: 'malformatted id' })
  } 
  else if (error.name === 'ValidationError') {    
    return response.status(400).json({ error: error.message })  }
  next(error)
}

// virheellisten pyyntöjen käsittely
app.use(errorHandler)


//Haetaan envistä käytettävä portti
const PORT = process.env.PORT

//Määritetään käytettävä portti ja kuunnellaan sieltä tulevia syötteitä
//PORT määritelty portti tai 3001, jos ympäristömuuttuja PORT ei ole määritelty. 
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})