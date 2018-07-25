# rabbitmq

## 安装

1. 安装 Erlang 的时候，一定要选择 最上面的那个选项插件。用于浏览器显示控制界面
2. 安装的目录路径不要存在空格

## 启动

1. 进入rabbirmq的安装目录 `/d/software/rabbitmq/rabbitmq_server-3.7.7/sbin`
2. 启动 `./rabbitmq-server.bat install`
3. 启用管理插件 `./rabbitmq-plugins.bat enable rabbitmq_management`
4. 浏览器登陆 `http://localhost:15672` + `guest as username` -- `guest as password`

其他一些基本操作

```js
1. 启动

rabbitmq-server &

2. 队列重置（清空队列、用户等）
rabbitmqctl stop_app
rabbitmqctl reset
rabbitmqctl stop

3. 关闭
rabbitmqctl stop

4. 列举所有用户
rabbitmqctl list_users

5. 列举所有队列
rabbitmqctl list_queues
```

* [重要的参考](https://www.cnblogs.com/kaituorensheng/p/4985767.html)

## 概念

### 队列、生产者、消费者

在RabbitMQ中，有一些基本术语：

* 生产者：就是发送信息这方。

* 任务队列：虽然信息流在RabbitMQ和你的应用之间流动，它可以存储在一个队列中。队列不受任何限制的约束，它可以存储任意多的消息，它本质上是一个无限的缓冲区。许多生产者可以将消息发往到这个队列中，许多消费者可以尝试从这个队列中接受数据。

* 消费者：消费者和信息接受者有相近的含义，一个消费者就是一个等待去接受信息的程序。

* [使用RabbitMQ 一](https://blog.csdn.net/m48o8gewuc/article/details/72871606)

### Exchange、Binding

### Exchange Type、Binding key、routing key

Exchange Type：
1. fanout 把所有发送到该 Exchange 的消息投递到所有与他绑定的队列中 -- 【广播】
2. direct 把消息投递到那些 binding key 与 routing key 完全匹配的队列中 -- 【定制】
3. topic  将消息路由到 binding key 与 routing key 模式匹配的队列中 -- 【正则匹配】
4. headers 用的比较少

![RabbitMQ的结构图](https://img-blog.csdn.net/20170828204522460?watermark/2/text/aHR0cDovL2Jsb2cuY3Nkbi5uZXQvZHJlYW1jaGFzZXJpbmc=/font/5a6L5L2T/fontsize/400/fill/I0JBQkFCMA==/dissolve/70/gravity/Center)

### Topic类型的exchange❗❗❗

Topic类型的exchange是很强大的，也可以实现其它类型的exchange。

* 当一个队列被绑定为binding key为”#”时，它将会接收所有的消息，此时和fanout类型的exchange很像。
* 当binding key不包含”*”和”#”时，这时候就很像direct类型的exchange。

### Exclusive Queue ❌❌❌❌❌❌❌❌❌❌❌❌❌❌❌❌很重要。必须要理解⭕⭕⭕⭕⭕⭕⭕⭕⭕⭕⭕⭕⭕

> 排他性队列

该队列的特点是：

* 只对首次声明它的连接（Connection）可见
* 会在其连接断开的时候自动删除。⛔⛔⛔⛔⛔⛔⛔⛔⛔⛔⛔⛔

对于第二点，RabbitMQ会自动删除这个队列，而不管这个队列是否被声明成持久性的（Durable =true)。 也就是说即使客户端程序将一个排他性的队列声明成了Durable的，只要调用了连接的Close方法或者客户端程序退出了，RabbitMQ都会删除这个队列。注意这里是连接断开的时候，而不是通道断开。这个其实前一点保持一致，只区别连接而非通道。

**参考**
* [排他性队列]](https://www.cnblogs.com/rader/archive/2012/06/28/2567779.html)

## 实际使用

### 定义队列

> assertQueue

```js
ch.assertQueue(q, {durable: true})
```

1. queue：这没什么好说的，队列名
2. durable：是否持久化.持久化，指的是队列持久化到数据库中。在之前的博文中也说过，如果RabbitMQ服务挂了怎么办，队列丢失了自然是不希望发生的。持久化设置为true的话，即使服务崩溃也不会丢失队列
3. exclusive：是否排外. 设置了排外为true的队列只可以在本次的连接中被访问，也就是说在当前连接创建多少个channel访问都没有关系，但是如果是一个新的连接来访问，对不起，不可以，下面是我尝试访问了一个排外的queue报的错。还有一个需要说一下的是，排外的queue在当前连接被断开的时候会自动消失（清除）无论是否设置了持久化
4. autoDelete：这个就很简单了，是否自动删除。也就是说queue会清理自己。但是是在最后一个connection断开的时候
5. arguments：这个值得拿出来单讲一次，暂时不说

### 接收消息

为了发送消息，我们需要定义一个`队列`，我们可以将`消息` ➡发送⬅到这个队列中：

```js
let q = 'task_queue3'
let msg = process.argv.slice(2).join(' ') || "Hello World!"
ch.assertQueue(q, {durable: true}) // RabbitMQ任务队列 持久化
ch.sendToQueue(q, new Buffer(msg), {persistent: true}) // 发送的消息也是持久化的
```

建立一个接受者的方式和发送者是相同的。打开一个连接和通道，并且申明一个需要处理的队列。`注意：这里的队列和发送者里面定义的队列需要匹配。`

```js
let q = 'task_queue3';

ch.assertQueue(q, {durable: true}); // 消息持久化;当一个RabbitMQ服务退出或者中断的情况下
```

这里也定义队列的原因：接受者可能比发送者先开始执行。我们需要确保当接受者处理queue的时候，queue是存在的。

由于消息的发送是异步的，我们需要提供一个回调，这样，当RabbitMQ发送消息给我们的消费者时，回调会执行。这个也是Channel.consume做的事情。

```js
ch.consume(q, function(msg) {
      let secs = msg.content.toString().split('.').length - 1;
      console.log(" [x] Received %s", msg.content.toString());
      setTimeout(function() {
        console.log(" [x] Done");
        ch.ack(msg); // 消息确认
      }, secs * 1000);
    }, {noAck: false});
```

### msg 包含的信息

```js
{ fields:
   { consumerTag: 'amq.ctag-0G90lW9Jx1IN1kAbuiVYaA',
     deliveryTag: 1,
     redelivered: false,
     exchange: 'ex_queue',❎
     routingKey: '' },❎ --> 需要使用 assertExchange 的时候才有。默认情况下是没有的
  properties:
   { contentType: undefined,
     contentEncoding: undefined,
     headers: {},   ❎ -->  需要使用 headers 的交换器模式才行
     deliveryMode: undefined,
     priority: undefined,
     correlationId: undefined,
     replyTo: undefined,
     expiration: undefined,
     messageId: undefined,
     timestamp: undefined,
     type: undefined,
     userId: undefined,
     appId: undefined,
     clusterId: undefined },
  content: <Buffer 68 65 6c 6c 6f 20 77 6f 72 6c 64 20 36> }
```

### bindQueue

> channel.queueBind(queueName, EXCHANGE_NAME, bindingKey)

```js
ch.bindQueue(q.queue, ex, severity)
```

queue 队列名称
exchange 交换器名称
routingKey 路由key
arguments 其它的一些参数


### 消息确认

处理一个复杂的任务需要耗费很长时间，这个时间段里面，可能我们的worker进程由于某种原因挂掉了，这种异常情况是需要考虑的。但是我们现有的代码里面并没有做这种异常的处理，当RabbitMQ将任务派发给worker进程之后，我们立即将这个任务从内存中剔除掉了，设想下，假设worker收到消息之后，我们马上将进程杀死掉，这个时候任务并没有被成功执行的。同时，我们也会丢失所有派发到这个worker进程但是还没有被处理的任务信息。


### 消息持久化

刚刚谈到，如果一个worker进程挂掉了，不让消息丢失的做法。但是，如果整个RabbitMQ的服务器挂掉了呢？当一个RabbitMQ服务退出或者中断的情况下，它会忘记任务队列里面的消息除非你告诉它不要丢掉，即我们通知RabbitMQ任务队列和这些任务都是需要持久化的。

首先，我们需要确保RabbitMQ永远不会丢失掉我们的任务队列。

```js
ch.assertQueue('hello', {durable: true});
```

接下来，我们需要通过配置persistent 选项让我们发送的消息也是持久化的。

```js
ch.sendToQueue(q, new Buffer(msg), {persistent: true});
```

## 参考

* [1](https://blog.csdn.net/m48o8gewuc/article/details/72871598)
* [2 git tutorials](https://github.com/rabbitmq/rabbitmq-tutorials/blob/master/javascript-nodejs/src/new_task.js)
* [中文文档](http://rabbitmq.mr-ping.com/description.html)
* [消息队列学习之一](https://blog.csdn.net/anzhsoft/article/details/19563091)
* [RabbitMQ 架构设计](http://www.cnblogs.com/wukong-holmes/p/9306733.html)

* [正确使用rabbitmq -- 控制界面](https://stackoverflow.com/questions/33951516/cannot-enable-rabbitmq-management-plugin-on-windows)