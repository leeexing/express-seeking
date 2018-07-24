/**
 * 消息队列
 * 发送者
 * RabbitMQ的调度方式，即采用Round-robin轮询调度算法。将消息均匀的分配给每个worker进程
 */
const amqp = require('amqplib/callback_api')

amqp.connect('amqp://localhost', (_, conn) => {
  conn.createChannel((err, ch) => {
    let ex = 'ex_direct'
    let args = process.argv.slice(2)
    let msg = args.join(' ') || "Hello World!"
    let severity = args.length ? args[0] : 'info'

    ch.assertExchange(ex, 'direct', {durable: false}) // RabbitMQ任务队列 持久化
    ch.publish(ex, severity, new Buffer(msg))
    console.log(`[X] send + ${severity} + "${msg}"`)
  })
  setTimeout(function() {
    conn.close()
    process.exit(0)
  }, 500)
})
