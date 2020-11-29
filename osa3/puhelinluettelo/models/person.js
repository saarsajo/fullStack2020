const mongoose = require('mongoose')

//Haetaan envistä tietokannan osoite
const url = process.env.MONGODB_URI

console.log('connecting to', url)

mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true })  .then(result => {
    console.log('connected to MongoDB')
  })
  .catch((error) => {
    console.log('error connecting to MongoDB:', error.message)
  })

//Määritellään puhelinluettelon skeema:
const personSchema = new mongoose.Schema({
  name: String,
  number: String
})

//Muotoilla Mongoosen palauttamat oliot haluttuun muotoon
personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports = mongoose.model('Person', personSchema)