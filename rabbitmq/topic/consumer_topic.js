/**
 * 消息队列
 * 接收者
 */
const amqp = require('amqplib/callback_api')

const args = process.argv.slice(2)
if (!args.length) {
  console.log('Usage: receive_topic.js <facility>.<severity>')
  process.exit(1)
}

amqp.connect('amqp://localhost', (error, conn) => {
  conn.createChannel((err, ch) => {
    let ex = 'ex_topic'

    ch.assertExchange(ex, 'topic', {durable: true})
    ch.prefetch(1);
    ch.assertQueue('', {exclusive: true}, (err, q) => {
      console.log(" [*] Waiting for messages in %s. To exit press CTRL+C", ex)

      // 绑定路由键[第三个参数]
      args.forEach(routingKey => {
        ch.bindQueue(q.queue, ex, routingKey)
      })

      ch.consume(q.queue, msg => {
        // console.log(msg)
        let msgContent = msg.content.toString()
        let ret = msgContent.match(/\d+/g)
        let secs = ret ? +ret[0] : 3
        console.log(" [x] Received %s -😜 -【%s】", msg.fields.routingKey, msgContent)

        setTimeout(function() {
          console.log(" [x] Done")
          ch.ack(msg) // 消息确认
        }, secs * 1000)
        
      }, {noAck: false})
    }, {durable: true})
  })
})
