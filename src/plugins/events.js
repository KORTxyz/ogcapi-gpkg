import fastifyPlugin from 'fastify-plugin'
import { EventEmitter } from 'node:events'

const eventsPlugin = async function (fastify) {

  const events = new EventEmitter()

  // Optional but recommended
  events.setMaxListeners(50)

  fastify.decorate('events', events)

}

export default fastifyPlugin(eventsPlugin, {
    fastify: '5.x',
    name: 'fastify-events',
})