/**
 * work
 */
const RabbitMQ = require('./index')
const mq = new RabbitMQ()
mq.receiveQueueMsg('testQueue', msg => {
  console.log(" ✅ success callback for -- %s", msg)
})