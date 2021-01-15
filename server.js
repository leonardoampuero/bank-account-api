const Hapi = require('hapi')
const Routes = require('./routes')
const HapiSwagger = require('hapi-swagger')
const HapiCors = require('hapi-cors')
const Inert = require('inert')
const Vision = require('vision')

const init = async () => {
  // Create a server with a host and port
  const server = await Hapi.server({
    host: 'localhost',
    port: 4000,
    routes: {
      validate: {
        failAction: (request, h, err) => {
          throw err
        }
      }
    }
  })

  // Add the route
  await server.route(Routes)

  /*
  await server.ext('onRequest', async (req, h) => {
    if (req.headers['api-key'] && req.headers['api-key'] === '123') {
      return h.continue
    } else {
      throw Boom.badRequest('Invalid Token')
    }
  })
  */
  const swaggerOptions = {
    info: {
      title: 'Bank Account API Documentation',
      version: '1.0.0'
    }
  }

  await server.register([
    Inert,
    Vision,
    {
      plugin: HapiCors,
      options: {
        methods: ['POST, GET, OPTIONS, DELETE'],
        headers: ['Accept', 'Content-Type', 'Authorization']
        // origin: ['*'], // an array of origins or 'ignore'
        // headers: ['Authorization'], // an array of strings - 'Access-Control-Allow-Headers' 
        // exposedHeaders: ['Accept'], // an array of exposed headers - 'Access-Control-Expose-Headers',
        // additionalExposedHeaders: ['Accept'], // an array of additional exposed headers
        // maxAge: 60,
        // credentials: true // boolean - 'Access-Control-Allow-Credentials'
      }
    },
    {
      plugin: HapiSwagger,
      options: swaggerOptions
    }
  ])

  await server.start()
  return server
}

init().then(server => {
  console.log('Server running at:', server.info.uri)
}).catch(error => {
  console.error(error)
})
