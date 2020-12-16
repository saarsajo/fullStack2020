//Ympäristömuuttujien käsittely eriytetään moduulin utils/config.js vastuulle
require('dotenv').config()

let PORT = process.env.PORT
let MONGODB_URI = process.env.MONGODB_URI

//Testejä suoritettaessa ohjelma käyttää erillistä, testejä varten luotua tietokantaa.
if (process.env.NODE_ENV === 'test') {  
  MONGODB_URI = process.env.TEST_MONGODB_URI
}

module.exports = {
  MONGODB_URI,
  PORT
}