const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')

//Määritellään userschema
const userSchema = mongoose.Schema({
  //Käyttäjänimen tulee olla uniikki ja vähintään 3 merkkiä pitkä  
  username: {
        type: String,
        minlength: 3,
        unique: true  
    },
    name: String,
    passwordHash: String,
  //Blogien id:t on talletettu käyttäjien sisälle taulukkona mongo-id:nä
    blogs: [
    {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Blog'
    }
    ],
})
userSchema.plugin(uniqueValidator)

userSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
    delete returnedObject.passwordHash
  }
})


const User = mongoose.model('User', userSchema)
module.exports = User