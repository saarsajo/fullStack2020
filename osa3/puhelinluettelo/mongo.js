const mongoose = require('mongoose')

if (process.argv.length<3) {
  console.log('give password as argument')
  process.exit(1)
}

//Koodille tulee antaa parametreja. MongoDB Atlasissa luotu salasana, lisättävä nimi ja puhelinnumero. 
//Komentoriviparametriin päästään käsiksi seuraavasti:
const password = process.argv[2]
const newName = process.argv[3]
const newNumber = process.argv[4]

//Tietokannan osoite
const url = `mongodb+srv://saarsajo:${password}@cluster0.p35ip.mongodb.net/<saarsajo>?retryWrites=true&w=majority`

//Avataan yhteys tietokantaan
mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true })

//Määritellään puhelinluettelon skeema ja sitä vastaava model:
const personSchema = new mongoose.Schema({
  name: String,
  number: String
})

const Person = mongoose.model('Person', personSchema)

//Seuraavaksi tiedoston mongo.js sovellus luo muistiinpanoa vastaavan 
//model:in avulla muistiinpano-olion:
const person = new Person({
    name: newName,
    number: newNumber
})

//Jos annetaan tyhjät argumentit tulostetaan tietokannan sisältö, muulloin lisätään uusi nimi ja 
//tulostetaan mitä on lisätty
if(!newName || !newNumber){
    console.log(`Phonebook:`)

    //Haetaan puhelinluettelon tiedot ja tulostetaan konsoliin
    Person.find({}).then(persons  => {
        persons.forEach(person => {
            console.log(`${person.name} ${person.number}`)
        })
        mongoose.connection.close()
    })
}
else{
    //Tallettaminen tapahtuu metodilla save. Metodi palauttaa promisen, 
    //jolle voidaan rekisteröidä then-metodin avulla tapahtumankäsittelijä:
    person.save().then(response => {
        console.log(`Added ${newName} number ${newNumber} to phonebook`);
        mongoose.connection.close()
    })
}