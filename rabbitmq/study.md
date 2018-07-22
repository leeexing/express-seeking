# rabbitmq


## 消息确认

处理一个复杂的任务需要耗费很长时间，这个时间段里面，可能我们的worker进程由于某种原因挂掉了，这种异常情况是需要考虑的。但是我们现有的代码里面并没有做这种异常的处理，当RabbitMQ将任务派发给worker进程之后，我们立即将这个任务从内存中剔除掉了，设想下，假设worker收到消息之后，我们马上将进程杀死掉，这个时候任务并没有被成功执行的。同时，我们也会丢失所有派发到这个worker进程但是还没有被处理的任务信息。


## 消息持久化

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