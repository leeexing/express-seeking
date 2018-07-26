/**
 * 消息队列
 * 接收者
 */
const amqp = require('amqplib/callback_api')

amqp.connect('amqp://localhost', (error, conn) => {
  conn.createChannel((err, ch) => {
    let ex = 'ex_fanout'

    ch.assertExchange(ex, 'fanout', {durable: true})
    // ch.prefetch(1);
    // assertQueue(queue?: string, options?: Options.AssertQueue, callback?: (err: any, ok: Replies.AssertQueue) => void): void;
    ch.assertQueue('', {exclusive: true}, (err, q) => {
      console.log(" [*] Waiting for messages in %s. To exit press CTRL+C", ex)
      // bindQueue(queue: string, source: string, pattern: string, args?: any, callback?: (err: any, ok: Replies.Empty) => void): void;
      // 🎈注意到 fanout 类型下的 bindQueue 不需要指定 RoutingKey（第三个参数）
      // 由于assertQueue第一个参数为 ‘’，所以这里的 q.queue 是一个随机字符串的队列名
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


/** 
1、在生产者和消费者的信道中声明exchange名字以及类型

2、在生产者的信道中指定发送目标的exchange

3、在消费者端的信道中声明一个随机的消息队列，并拿到这个队列名称；然后在信道上绑定该消息队列和消息路由
*/


/** 
 * 
 * {exclusive: false} 【前提】

由于ch.assertQueue（）申明队列的时候，没有指定明确的队列名，那么系统就会随机生成一个队列名
同时，我们在创建消息交换机的时候，设置了 durable 为 true，且 exlusive 为 false --> 意味着
我们在断开连接（消费者离开）的时候，之前创建的交换机不会消除，继续保留，同时它的队列名称是随机的，那就不会
再通过这个交换机进行消息推送了。
其次，如果之前在这个交换机中发送消息到队列中，且没有被消费。那么这里的消息队列和消息都会被保留下来
                                🔻
amq.gen--hmvNxdv5prKGSxxW7uqmw	D 	idle 	2 	0 	2 	

如果再执行这个脚本，那么又会重新创建一个消息队列（随机的）

amq.gen-VC4c618W9wbHUlPki6WG4g	D 	idle 	0 	0 	0

重要❗❗❗
而且在这种情况下，由于都是默认和名为 `ex_fanout` 的交换机建立起来绑定。绑定的 routingKey 为 ‘default exchange binding’ 
虽然队列名是系统随机的。但是绑定了相同的 routingKey
这是一个广播模式
那么，及时消费者离开，消息还是会广播到之前创建的队列里面 且 不会再有与之对应的消费者消费掉了。因为没法追踪到了
所以，这种情况下
第一就是，durable设置为 false
第二就是 exclusive 设置为 true 独享 -- 只跟第一次建立的消费者建立联系，消费者离开，这个队列就自动清除

很需要借助 plugin—manager 到浏览器进行查看

exclusive 设置为 true 后
                                🔻exclusive
amq.gen-a-P5r44cZoII6oi5f3IMVw	Excl 	idle 	0 	0 	0 	0.00/s 	

消费者离开后，这个消息队列就会被清除
*/
