/**
 * 消息队列
 * 发送者
 * RabbitMQ的调度方式，即采用Round-robin轮询调度算法。将消息均匀的分配给每个worker进程
 */
const amqp = require('amqplib/callback_api')

amqp.connect('amqp://localhost', (_, conn) => {
  conn.createChannel((err, ch) => {
    let ex = 'ex_fanout'
    let msg = process.argv.slice(2).join(' ') || "Hello World!"

    ch.assertExchange(ex, 'fanout', {durable: true}) // RabbitMQ任务队列 持久化
    // publish(exchange: string, routingKey: string, content: Buffer, options?: Options.Publish): boolean;
    ch.publish(ex, '', new Buffer(msg), {deliveryMode: 2}) // 消息持久化；1：非持久化
    console.log(`[X] send "${msg}"`)
  })
  setTimeout(function() {
    conn.close()
    process.exit(0)
  }, 500)
})
