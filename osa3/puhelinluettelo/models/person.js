const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')
mongoose.set('useFindAndModify', false)

//Haetaan envistä tietokannan osoite
const url = process.env.MONGODB_URI

console.log('connecting to', url)

mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true})  
.then(result => {
    console.log('connected to ', url)
})
.catch((error) => {
    console.log('error connecting to MongoDB:', error.message)
})

//Määritellään puhelinluettelon skeema:
const personSchema = new mongoose.Schema({
  name: {
      type: String,
      minLength: 3,
      required: true,
      unique: true
  },
  number: {
    type: String,
    minLength: 8,
    required: true,
    unique: true
  }
})

personSchema.plugin(uniqueValidator)

//Muotoilla Mongoosen palauttamat oliot haluttuun muotoon
personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports = mongoose.model('Person', personSchema)