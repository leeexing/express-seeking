/**
 * work
 */
const RabbitMQ = require('./rabbitMq')
const mq = new RabbitMQ()
mq.receiveQueueMsg('testQueue', msg => {
  console.log(" ✅ success callback for -- %s", msg)
})