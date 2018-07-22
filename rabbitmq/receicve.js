/**
 * 消息队列
 * 接收者
 */
const amqp = require('amqplib/callback_api')

amqp.connect('amqp://localhost', (error, conn) => {
  conn.createChannel((err, ch) => {
    let q = 'task_queue3';

    ch.assertQueue(q, {durable: true}); // 消息持久化;当一个RabbitMQ服务退出或者中断的情况下
    ch.prefetch(1); // 指定某个worker同时最多只会派发到1个任务，一旦任务处理完成发送了确认通知，才会有新的任务派发过来
    console.log(" [*] Waiting for messages in %s. To exit press CTRL+C", q);
    ch.consume(q, function(msg) {
      let secs = msg.content.toString().split('.').length - 1;
      console.log(" [x] Received %s", msg.content.toString());
      setTimeout(function() {
        console.log(" [x] Done");
        ch.ack(msg); // 消息确认
      }, secs * 1000);
    }, {noAck: false});
  })
})
