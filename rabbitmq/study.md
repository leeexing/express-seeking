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

AMQP协议是一个高级抽象层消息通信协议，RabbitMQ是AMQP协议的实现

### 主要组件

1. server（broker）：即消息队列服务器实体。接收客户端连接，实现AMQP消息队列和路由功能的进程
2. Virtual Host：一个虚拟概念，类似于权限控制组，一个virtual host 里面可以有若干个 Exchange 和 Queue
3. Exchange：消息交换机，它指定消息按什么规则，路由到哪个队列。接收生产者发送的消息，并根据Binding规则将消息路由给服务器中的队列。ExchangeType决定Exchange路由消息的行为
4. Message Queue：消息队列载体，用于存储还未被消费者消费的消息
5. Message: 由Header和Body组成，Header是由生产者添加的各种属性的集合，包括Message是否被持久化、由哪个Message Queue接受、优先级是多少等。而Body是真正需要传输的APP数据。
6. Binding： Binding 连系了 Exchagne 和 Message Queue。exchange 在与多个Message Queue 发生binging后会生成一张路由表，路由表中存储着Message Queue所需信息的限制条件 -- Binding Key
    当 exchange 收到 message时会解析其header得到 Routing key，exchange根据Routing Key 与 Exchange Type 将message 路由到 Message Queue。
7. Connection:连接，对于RabbitMQ而言，其实就是一个位于客户端和Broker之间的TCP连接。
8. Channel:信道，仅仅创建了客户端到Broker之间的连接后，客户端还是不能发送消息的。需要为每一个Connection创建Channel，AMQP协议规定只有通过Channel才能执行AMQP的命令。一个Connection可以包含多个Channel。之所以需要Channel，是因为TCP连接的建立和释放都是十分昂贵的，如果一个客户端每一个线程都需要与Broker交互，如果每一个线程都建立一个TCP连接，暂且不考虑TCP连接是否浪费，就算操作系统也无法承受每秒建立如此多的TCP连接。RabbitMQ建议客户端线程之间不要共用Channel，至少要保证共用Channel的线程发送消息必须是串行的，但是建议尽量共用Connection。
9. Command:AMQP的命令，客户端通过Command完成与AMQP服务器的交互来实现自身的逻辑。例如在RabbitMQ中，客户端可以通过publish命令发送消息，txSelect开启一个事务，txCommit提交一个事务。

### 特性

[看看](https://www.cnblogs.com/woms/p/7040882.html)

### 使用场景

**场景1：单发送单接收**

使用场景：简单的发送与接收，没有特别的处理。

**场景2：单发送多接收**

使用场景：一个发送端，多个接收端，如分布式的任务派发。为了保证消息发送的可靠性，不丢失消息，使消息持久化了。同时为了防止接收端在处理消息时down掉，只有在消息处理完成后才发送ack消息。

**场景3：Publish/Subscribe**

使用场景：发布、订阅模式，发送端发送广播消息，多个接收端接收。

*发送端：*
发送消息到一个名为“logs”的exchange上，使用“fanout”方式发送，即广播消息，不需要使用queue，发送端不需要关心谁接收。

*接收端：*

1、声明名为“logs”的exchange的，方式为"fanout"，和发送端一样。

2、channel.queueDeclare().getQueue();该语句得到一个`随机名称的Queue`，该queue的类型为non-durable、exclusive、auto-delete的，将该queue绑定到上面的exchange上接收消息。

3、注意binding queue的时候，channel.queueBind()的`第三个参数Routing key为空，即所有的消息都接收`。如果这个值不为空，在exchange type为“fanout”方式下该值被忽略！

**场景4：Routing (按路线发送接收)**Type=direct

```Type
*.orange.*, *.*.rabbit, lazy.*
```

使用场景：发送端按routing key发送消息，不同的接收端按不同的routing key接收消息。

*发送端和场景3的区别：*

1、exchange的type为direct
2、发送消息的时候加入了routing key

*接收端和场景3的区别：*

在绑定queue和exchange的时候使用了routing key，即从该exchange上只接收routing key指定的消息。

**场景5：Topics (按topic发送接收)**Type=topic

使用场景：发送端不只按固定的routing key发送消息，而是按字符串“匹配”发送，接收端同样如此。

*发送端和场景4的区别：*

1、exchange的type为topic
2、发送消息的routing key不是固定的单词，而是匹配字符串，如"*.lu.#"，*匹配一个单词，#匹配0个或多个单词。

*接收端和场景4的区别：*

1、exchange的type为topic
2、接收消息的routing key不是固定的单词，而是匹配字符串。


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
  * 它采取广播模式，消息进来时，将会被投递到与改交换机绑定的所有队列中。
  * 对于Fanout类型的exchange，会忽略binding key。

2. direct 把消息投递到那些 binding key 与 routing key 完全匹配的队列中 -- 【定制】
  * 完全根据key进行投递。例如，绑定时设置了routing key为abc，客户端提交信息提交信息时只有设置了key为abc的才会投递到队列；

3. topic  将消息路由到 binding key 与 routing key 模式匹配的队列中 -- 【正则匹配】
  * 在key进行模式匹配后进行投递。例如：符号”#”匹配一个或多个字符，符号”*”匹配一串连续的字母字符，例如”abc.#”可以匹配”abc.def.ghi”，而”abc.*”只可以匹配”abc.def”。

4. headers 用的比较少

![RabbitMQ的结构图](https://img-blog.csdn.net/20170828204522460?watermark/2/text/aHR0cDovL2Jsb2cuY3Nkbi5uZXQvZHJlYW1jaGFzZXJpbmc=/font/5a6L5L2T/fontsize/400/fill/I0JBQkFCMA==/dissolve/70/gravity/Center)

### Topic类型的exchange❗❗❗

Topic类型的exchange是很强大的，也可以实现其它类型的exchange。

* 当一个队列被绑定为binding key为”#”时，它将会接收所有的消息，此时和fanout类型的exchange很像。
* 当binding key不包含”*”和”#”时，这时候就很像direct类型的exchange。

### 申明队列🔔🔔🔔

> assertQueue(queue?: string, options?: Options.AssertQueue, callback?: (err: any, ok: Replies.AssertQueue) => void): void;

默认情况下，我们创建的消息队列以及存放在队列里面的消息，都是`非持久化的`。也就是说当rabbitMQ宕掉了或者时重启了，创建的消息队列以及消息都不会保存

❓❓❓❓❓❓ 不是理解
将队列设置为持久化后，还需要将发送的消息也要设置为持久化才能保证队列和消息一直存在

❓如果队列设置为持久化，消息不设置为持久化，会是一个什么样的情况❓
🕵️‍‍‍‍‍‍‍‍🕵️‍🕵️‍♂️
可能我仅仅只是测试了，断开连接的情况，没有测试到服务器宕机的这种情况
所以，消息是否还在服务器宕机的情况下保留了这一点，没有确认，但是
的确时确认了，消息没有设置持久化，断开连接后重新连接，还是能够接收到之前的消息

[看一些这一篇文章](https://www.cnblogs.com/Keep-Ambition/p/8044752.html)

```js
//          1、队列名       2、可选参数配置                 3、回掉函数  第一个为错误   2、第二个为ok，值为定义的队列。具体是一个队列          
assertQueue(queue?: string, options?: Options.AssertQueue, callback?: (err: any, ok: Replies.AssertQueue) => void): void;
```

同样还有删除队列的操作🆑🆑
**deleteQueue(queue: string, options?: Options.DeleteQueue, callback?: (err: any, ok: Replies.DeleteQueue) => void): void;**

```js
ch.assertQueue(q, {durable: true})

// 或者
ch.assertQueue('', {exclusive: false}, (err, q) => {})
```

queue：queue的名称

exclusive：排他队列，如果一个队列被声明为排他队列，该队列仅对首次申明它的连接可见，并在连接断开时自动删除。这里需要注意三点：1. 排他队列是基于连接可见的，同一连接的不同信道是可以同时访问同一连接创建的排他队列；2.“首次”，如果一个连接已经声明了一个排他队列，其他连接是不允许建立同名的排他队列的，这个与普通队列不同；3.即使该队列是持久化的，一旦连接关闭或者客户端退出，该排他队列都会被自动删除的，这种队列适用于一个客户端发送读取消息的应用场景。

autoDelete：自动删除，如果该队列没有任何订阅的消费者的话，该队列会被自动删除。这种队列适用于临时队列。

### 申明交换器

```js
//             1、路由交换器名称      2、
assertExchange(exchange: string, type: string, options?: Options.AssertExchange, callback?: (err: any, ok: Replies.AssertExchange) => void): void;
```

```js
ch.assertExchange(ex, 'fanout', {durable: true})
```

### Exclusive Queue ❌❌❌❌❌❌❌❌❌❌❌❌❌❌❌❌很重要。必须要理解⭕⭕⭕⭕⭕⭕⭕⭕⭕⭕⭕⭕⭕

> 排他性队列

该队列的特点是：

* 只对首次声明它的连接（Connection）可见
* 会在其连接断开的时候自动删除。⛔⛔⛔⛔⛔⛔⛔⛔⛔⛔⛔⛔

对于第二点，RabbitMQ会自动删除这个队列，而不管这个队列是否被声明成持久性的（Durable =true)。 也就是说即使客户端程序将一个排他性的队列声明成了Durable的，只要调用了连接的Close方法或者客户端程序退出了，RabbitMQ都会删除这个队列。注意这里是连接断开的时候，而不是通道断开。这个其实前一点保持一致，只区别连接而非通道。

**参考**
* [排他性队列]](https://www.cnblogs.com/rader/archive/2012/06/28/2567779.html)

### 发送消息

```js
sendToQueue(queue: string, content: Buffer, options?: Options.Publish): boolean;

// 使用交换器的时候 使用订阅发布模式
publish(exchange: string, routingKey: string, content: Buffer, options?: Options.Publish): boolean;
```


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

**消息公平分发**

如果Rabbit只管按顺序把消息发到各个消费者身上，不考虑消费者负载的话，很可能出现，一个机器配置不高的消费者那里堆积了很多消息处理不完，同时配置高的消费者却一直很轻松。为解决此问题，可以在各个消费者端，配置perfetch=1,意思就是告诉RabbitMQ在我这个消费者当前消息还没处理完的时候就不要再给我发新消息了

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

1. 消息交换机（exchange）持久化，在声明时指定durable为
2. 消息队列（queue）持久化，在声明时指定durable为
3. 消息持久化，在投递时指定delivery_mode为2（1是非持久化

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

* [1 在 node 中使用 rabbitmq](https://blog.csdn.net/m48o8gewuc/article/details/72871598)
* [2 git tutorials](https://github.com/rabbitmq/rabbitmq-tutorials/blob/master/javascript-nodejs/src/new_task.js)
* [中文文档](http://rabbitmq.mr-ping.com/description.html)
* [消息队列学习之一](https://blog.csdn.net/anzhsoft/article/details/19563091)
* [RabbitMQ 架构设计](http://www.cnblogs.com/wukong-holmes/p/9306733.html)
* [基础文章系列](http://www.cnblogs.com/leocook/p/mq_rabbitmq_0.html)
* [正确使用rabbitmq -- 控制界面](https://stackoverflow.com/questions/33951516/cannot-enable-rabbitmq-management-plugin-on-windows)