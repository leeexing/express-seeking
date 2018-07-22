/**
 * 消息队列
 * 发送者
 * RabbitMQ的调度方式，即采用Round-robin轮询调度算法。将消息均匀的分配给每个worker进程
 */
const amqp = require('amqplib/callback_api')

amqp.connect('amqp://localhost', (_, conn) => {
  conn.createChannel((err, ch) => {
    let q = 'task_queue3'
    let msg = process.argv.slice(2).join(' ') || "Hello World!"

    ch.assertQueue(q, {durable: true}) // RabbitMQ任务队列 持久化
    ch.sendToQueue(q, new Buffer(msg), {persistent: true}) // 发送的消息也是持久化的
    console.log(`[X] send "Hello World"`)
  })
  setTimeout(function() {
    conn.close()
    process.exit(0)
  }, 500)
})
