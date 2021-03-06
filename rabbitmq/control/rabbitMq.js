/**
 * 消息队列控制类
 * 
 */
const amqp = require('amqplib')

class RabbitMQ {
  constructor() {
    this.hosts = ['amqp://localhost']
    this.index = 0
    this.length = this.hosts.length
    this.open = amqp.connect(this.hosts[this.index])
  }
  // 生产者
  sendQueueMsg (queueName, msg, errCallback) {
    let that = this
    this.open.then(conn => conn.createChannel())
      .then(ch => {
        return ch.assertQueue(queueName, {durable: true}).then(ok => {
          return ch.sendToQueue(queueName, new Buffer(msg), {
            persistent: true
          })
        }).then(data => {
          console.log(`[X] send "Hello World"`)
          if (data) {
            console.log(data)
            errCallback && errCallback('success')
            ch.close()
          }
        }).catch(err => {
          console.log(err)
          setTimeout(() => {
            ch && ch.close()
          }, 500)
        })
      })
      .catch(_ => {
        let num = that.index++
        if (num <= that.length - 1) {
          that.open = amqp.connect(that.hosts[num])
        } else {
          that.index == 0
        }
      })
  }
  // 消费者
  receiveQueueMsg (queueName, receiveCallback, errCallback) {
    let that = this
    that.open
    .then(conn => conn.createChannel())
    .then(ch => {
      return ch.assertQueue(queueName, {durable: true}).then(ok => {
        return ch.consume(queueName, msg => {
          if (msg) {
            let data = msg.content.toString()
            console.log(" [x] Received %s", data);
            setTimeout(() => {
              console.log(" [x] Done");
              ch.ack(msg)
              receiveCallback && receiveCallback(data)
            }, 2000)
          }
        })
        .catch(err => console.log(err))
        .finally(() => {
          console.log(" [*] Waiting for messages in %s. To exit press CTRL+C", queueName)
        })
      })
    })
    .catch(_ => {
      let num = that.index++
      if (num <= that.length - 1) {
        that.open = amqp.connect(that.hosts[num])
      } else {
        that.index = 0
        that.open = amqp.connect(that.hosts[0])
      }
    })
  }
  // exchange 发布
  publishExchangeMsg ({exchangeName='', exType='direct', routingKey='info', msg='Hello World!', errCallback=null}) {
    let that = this
    this.open.then(conn => conn.createChannel())
      .then(ch => {
        return ch.assertExchange(exchangeName, exType, {durable: true}).then(ex => { // 连接交换机
          return ch.assertQueue(ex).then(q => { // 连接队列
                      // 队列     交换机        Routing key     arguments
            ch.bindQueue(q.queue, ex.exchange, routingKey)
            // ch.bindQueue(q.queue, ex.exchange, routingKey, {'x-path': 'any', 'foo': 'bar', 'baz': 'boo'})

            msg = typeof msg === 'object' ? JSON.stringify(msg) : msg
            ch.publish(ex.exchange, exType, Buffer.from(msg))
          }).then(data => {
            console.log(data)
            if (data) {
              console.log(data)
            }
          })
          .catch(err => {
            console.log(err)
          })
        })
      })
      .catch(() => {
        let num = that.index++
        if (num <= that.length - 1) {
          that.open = amqp.connect(that.hosts[num])
        } else {
          that.index = 0
          that.open = amqp.connect(that.hosts[0])
        }
      })
  }
  // 订阅
  receiveExchangeMsg ({exchangeName='', exType='direct', routingKey='info', receiveCallBack=null, errCallback=null}) {
    let that = this
    this.open.then(conn => conn.createChannel())
      .then(ch => {
        return ch.assertExchange(exchangeName, exType, {durable: true}).then(ex => { // 连接交换机
          return ch.assertQueue(ex).then(q => { // 连接队列
                      // 队列     交换机        Routing key     arguments
            ch.bindQueue(q.queue, ex.exchange, routingKey)

            ch.consume(q.queue, msg => {
              console.log(msg)
              let msgContent = msg.content.toString()
              let jsonData
              try {
                jsonData = JSON.parse(msgContent)
              } catch (err) {
                jsonData = msgContent
              }
              let ret = msgContent.match(/\d+/g)
              let secs = ret ? +ret[0] : 3
              console.log(" [x] Received %s 【%s】", msgContent, msg.fields.routingKey)
      
              setTimeout(function() {
                console.log(" [x] Done")
                ch.ack(msg)
                receiveCallBack && receiveCallBack(jsonData)
              }, secs * 1000)
              
            }, {noAck: false})

          }).then(data => {
            console.log(data)
            if (data) {
              console.log(data)
            }
          })
          .catch(err => {
            console.log(err)
          })
        })
      })
      .catch(() => {
        let num = that.index++
        if (num <= that.length - 1) {
          that.open = amqp.connect(that.hosts[num])
        } else {
          that.index = 0
          that.open = amqp.connect(that.hosts[0])
        }
      })
  }
}

module.exports = RabbitMQ
