const bcryptjs = require('bcryptjs')
const usersRouter = require('express').Router()
const User = require('../models/user')

//hakee kaikki käyttäjät
usersRouter.get('/', async (request, response) => {
    const users = await User
      .find({}).populate('blogs', { url: 1, title: 1, author: 1 })
    response.json(users.map(user => user.toJSON()))
  })

//luo uuden käyttäjän pyynnön mukana olevasta datasta
usersRouter.post('/', async (request, response, next) => {
//Tarkastetaan että salasana on vähintään 3 merkkiä pitkä
  if (request.body.password.length < 3) {
    return response.status(400).send('The password must be more than 3 characters long').end()
  }

  //Jos salasana on pitempi kuin kolme lisätään käyttäjä
  try{
    const body = request.body
    const saltRounds = 10

    //Tietokantaan ei talleteta pyynnön mukana tulevaa salasanaa, vaan funktion bcryptjs.hash avulla laskettu hash
    const passwordHash = await bcryptjs.hash(body.password, saltRounds)

    const user = new User({
        username: body.username,
        name: body.name,
        passwordHash,
        blogs: body.blogs
    })

    const savedUser = await user.save()

    
    response.status(201).json(savedUser.toJSON())
  } catch (exception) {
    next(exception)
  }
})

module.exports = usersRouter