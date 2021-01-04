const config = require('./utils/config')
const express = require('express')
const app = express()
const cors = require('cors')

const blogsRouter = require('./controllers/blogs')
const loginRouter = require('./controllers/login')
const usersRouter = require('./controllers/users')

const middleware = require('./utils/middleware')
const logger = require('./utils/logger')
const mongoose = require('mongoose')

mongoose.connect(config.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true})
  .then(() => {
    logger.info('connected to MongoDB')
  })
  .catch((error) => {
    logger.error('error connection to MongoDB:', error.message)
  })

app.use(cors())
app.use(express.static('build'))
app.use(express.json())
//Middleware otetaan käyttöön
app.use(middleware.requestLogger)

app.use('/api/login', loginRouter)
//ottaa määrittelemämme routerin käyttöön:
app.use('/api/blogs', blogsRouter)
//huolehditaan polulle /api/users/ tulevista pyynnöistä
app.use('/api/users', usersRouter)

app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

module.exports = app