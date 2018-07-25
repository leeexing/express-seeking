/**
 * 消息队列
 * 发送者
 * RabbitMQ的调度方式，即采用Round-robin轮询调度算法。将消息均匀的分配给每个worker进程
 */
const amqp = require('amqplib/callback_api')

amqp.connect('amqp://localhost', (_, conn) => {
  conn.createChannel((err, ch) => {
    let ex = 'ex_topic'
    let args = process.argv.slice(2)
    let routeKey = args.length ? args[0] : 'anonymous.info'
    let msg = args.slice(1).join(' ') || "Hello World!"

    ch.assertExchange(ex, 'topic', {durable: true}) // RabbitMQ任务队列 持久化
    // ch.assertQueue(ex, {durable: true}) // RabbitMQ任务队列 持久化
    ch.publish(ex, routeKey, new Buffer(msg))
    console.log(`[X] send 【${routeKey}】: ${msg}`)
  })
  setTimeout(function() {
    conn.close()
    process.exit(0)
  }, 500)
})
