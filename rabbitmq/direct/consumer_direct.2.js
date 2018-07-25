/**
 * 消息队列
 * 接收者
 */
const amqp = require('amqplib/callback_api')

const args = process.argv.slice(2)
if (!args.length) {
  console.log('Usage: receive_direct.js [info] [warning] [danger] [error] [success] ...')
  process.exit(1)
}

amqp.connect('amqp://localhost', (error, conn) => {
  conn.createChannel((err, ch) => {
    let ex = 'ex_direct'

    ch.assertExchange(ex, 'direct', {durable: true})
    ch.prefetch(1);
    //            定义为空字符，就不能很好和【队列名】绑定了❌❌❌.同事exclusive不能为true。它指的是排他性【独享】。设为true后，断开服务后，这个队列也就倍清除了
    ch.assertQueue('', {exclusive: false}, (err, q) => {
      console.log(" [*] Waiting for messages in %s. To exit press CTRL+C", ex)
      console.log(q)
      // 绑定路由键[第三个参数]
      args.forEach(severity => {
        ch.bindQueue(q.queue, ex, severity)
      })

      ch.consume(q.queue, msg => {
        // console.log(msg)
        let msgContent = msg.content.toString()
        let ret = msgContent.match(/\d+/g)
        let secs = ret ? +ret[0] : 3
        console.log(" [x] Received %s 【%s】", msgContent, msg.fields.routingKey)

        setTimeout(function() {
          console.log(" [x] Done")
          ch.ack(msg) // 消息确认
        }, secs * 1000)
        
      }, {noAck: false})

    })
  })
})
