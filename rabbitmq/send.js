/**
 * 消息队列
 * 发送者
 * RabbitMQ的调度方式，即采用Round-robin轮询调度算法。将消息均匀的分配给每个worker进程
 * 【简单模式·demo】
 * [还是查看官方文档吧❗❗❗](https://github.com/squaremo/amqp.node)
 */
const amqp = require('amqplib/callback_api')
// var open = require('amqplib').connect('amqp://localhost') // Promise API style✅✅✅

amqp.connect('amqp://localhost', (_, conn) => {
  conn.createChannel((err, ch) => {
    let q = 'task_queue'
    let msg = process.argv.slice(2).join(' ') || "Hello World!"

    ch.assertQueue(q, {durable: true}) // RabbitMQ任务队列 持久化
    ch.sendToQueue(q, new Buffer(msg))
    // ch.sendToQueue(q, new Buffer(msg), {persistent: true}) // 发送的消息也是持久化的
    console.log(`[X] send "Hello World"`)
  })
  setTimeout(function() {
    conn.close()
    process.exit(0)
  }, 500)
})

/**
1. 虽然这种方式没有使用 assertExchange,但是在 rabbitmq 的后台处理中还是默认给这个队列指定了 Exchagne -- 

Exchange：（AMQP default）
Routing Key：task_queue
Payload: Hello World
properties: {headers:}

这里查看到的是这样的： binding 的 exchange 是 （default exchange binding）。routingKey 是 task_queue 

没有使用都exchange的相关知识，但是任然能够发送消息。之所以能发送成功是因为我们使用一个默认exchange，我们使用（””）来标识的。
channel.basicPublish("", "hello", null, message.getBytes());
第一个参数就是exchange的名字。空字符串的符号指的是默认的或没有命名的exchange：消息会根据routingKey被路由到指定的消息队列中。

消息推送到已命名的exchange上：
channel.basicPublish( "logs", "", null, message.getBytes());


$ ./rabbitmqctl.bat list_bindings
Listing bindings for vhost /...
        exchange        ex_direct       queue   ex_direct       []
        exchange        ex_topic        queue   ex_topic        []
        exchange        task_queue      queue   task_queue      []
ex_direct       exchange        ex_direct       queue   info    []
ex_direct       exchange        ex_direct       queue   warn    []
ex_topic        exchange        ex_topic        queue   *.info  []
ex_topic        exchange        ex_topic        queue   *.warn  []
*/
