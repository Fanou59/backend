import Fastify from "fastify"
import { fastifyPostgres } from '@fastify/postgres'

const fastify = Fastify({
    logger: true
})

fastify.register(fastifyPostgres, {
  connectionString: 'postgres://user:password@localhost:5432/mydatabase'
})

fastify.get('/', function (req, reply){
    reply.send({ hello : 'world' })
})

// choix selon un titre -> il faut encore gérer l'erreur si le titre n'est pas trouvé
fastify.get('/list/:titre', function (req, reply) {
  fastify.pg.query(
    'SELECT titre,volume,vehicle, akey, tempo, chorus, disc, track FROM mydatabase.aebersold WHERE titre=$1', [req.params.titre],
    function onResult (err, result) {
        const {titre, volume, vehicle, akey, tempo, chorus, disc, track} = result.rows[0]
      reply.send(err || ({titre, volume, vehicle, akey, tempo, chorus, disc, track}))
    }
  )
})

// récupération de l'ensemble de la base de donnée
fastify.get('/list', function (req, reply) {
    fastify.pg.query(
      'SELECT titre,volume,vehicle, akey, tempo, chorus, disc, track FROM mydatabase.aebersold',
      function onResult (err, result) {
        reply.send(err || result.rows)
      }
    )
  })

fastify.listen({ port: 3000 }, err => {
  if (err) throw err
  console.log(`server listening on ${fastify.server.address().port}`)
})