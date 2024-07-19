import Fastify from "fastify"
import { fastifyPostgres } from '@fastify/postgres'

const fastify = Fastify({
    logger: true
})

fastify.register(fastifyPostgres, {
  connectionString: 'postgres://user:password@localhost:5432/mydatabase'
})

fastify.get('/titre/:id', function (req, reply) {
  fastify.pg.query(
    'SELECT titre FROM mydatabase.aebersold WHERE id=$1', [req.params.id],
    function onResult (err, result) {
      reply.send(err || result)
    }
  )
})

fastify.listen({ port: 3000 }, err => {
  if (err) throw err
  console.log(`server listening on ${fastify.server.address().port}`)
})