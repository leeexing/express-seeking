/**
 * send
 */
const RabbitMQ = require('./rabbitMq')
const mq = new RabbitMQ()
let count = 0
let msg = {
  name: 'leeing',
  length: 1
}
let timer = setInterval(() => {
  if (count++ > 3) {
    clearInterval(timer)
    process.exit(0)
  }
  mq.sendQueueMsg('testQueue', msg.name, err => {
    console.log(err)
  })
}, 2000)