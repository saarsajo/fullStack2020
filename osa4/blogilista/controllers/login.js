const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const loginRouter = require('express').Router()
const User = require('../models/user')

loginRouter.post('/', async (request, response) => {
  const body = request.body

  //Koodi aloittaa etsimällä pyynnön mukana olevaa usernamea vastaavan käyttäjän tietokannasta
  const user = await User.findOne({ username: body.username })
  const passwordCorrect = user === null
    ? false
    //Tietokantaan ei ole talletettu salasanaa, vaan salasanasta laskettu hash, tehdään vertailu seuraavasti:
    : await bcrypt.compare(body.password, user.passwordHash)

  //Jos käyttäjää ei ole olemassa tai salasana on väärä, vastataan kyselyyn statuskoodilla 401 unauthorized
  if (!(user && passwordCorrect)) {
    return response.status(401).json({
      error: 'invalid username or password'
    })
  }

  const userForToken = {
    username: user.username,
    id: user._id,
  }

  //Jos salasana on oikein, luodaan token, joka sisältää digitaalisesti allekirjoitetussa muodossa 
  //käyttäjätunnuksen ja käyttäjän id:
  const token = jwt.sign(userForToken, process.env.SECRET)

  response
    .status(200)
    .send({ token, username: user.username, name: user.name })
})

module.exports = loginRouter