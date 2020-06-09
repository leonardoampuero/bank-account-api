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
