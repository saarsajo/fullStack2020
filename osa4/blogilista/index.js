//index.js ainoastaan importaa tiedostossa app.js olevan varsinaisen sovelluksen ja käynnistää sen. 
const app = require('./app') // the actual Express app
const http = require('http')
const config = require('./utils/config')
const logger = require('./utils/logger')

//Sovelluksen käynnistäminen tapahtuu server-muuttujassa olevan olion kautta.
//index.js ainoastaan importaa tiedostossa app.js olevan varsinaisen sovelluksen ja käynnistää sen. 
const server = http.createServer(app)

server.listen(config.PORT, () => {
  logger.info(`Server running on port ${config.PORT}`)
})