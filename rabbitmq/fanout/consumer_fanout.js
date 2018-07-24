/**
 * 消息队列
 * 接收者
 */
const amqp = require('amqplib/callback_api')

amqp.connect('amqp://localhost', (error, conn) => {
  conn.createChannel((err, ch) => {
    let ex = 'ex_queue'

    ch.assertExchange(ex, 'fanout', {durable: true})
    // ch.prefetch(1);
    ch.assertQueue('', {exclusive: false}, (err, q) => {
      console.log(" [*] Waiting for messages in %s. To exit press CTRL+C", ex)
      ch.bindQueue(q.queue, ex, '')

      ch.consume(q.queue, function(msg) {
        // console.log(msg)
        let msgContent = msg.content.toString()
        let ret = msgContent.match(/\d+/g)
        let secs = ret ? +ret[0] : 3
        console.log(" [x] Received %s", msgContent)

        setTimeout(function() {
          console.log(" [x] Done")
          ch.ack(msg) // 消息确认
        }, secs * 1000)
        
      }, {noAck: false})
    })
  })
})
