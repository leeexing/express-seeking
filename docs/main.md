# Knight

## 如何使用Redis

* 方法一：将redisClient存储在node的全局对象global中
* 方法二： 将redis初始化方法，封装在index.js中，然后exports出去

## post传参

使用postman的时候，注意 body 的类型。不要使用 form-data
可以是 `x-www-form-urlencoded` 或者 raw 的 `application/json`

## node API

### Buffer

> 翻译：缓冲区、缓冲器

JavaScript 语言自身只有字符串数据类型，没有二进制数据类型。
但在处理像TCP流或文件流时，必须使用到二进制数据。因此在 Node.js中，定义了一个 Buffer 类，该类用来创建一个专门存放二进制数据的缓存区。

```js
const buf = Buffer.from('runoob', 'ascii');

// 输出 72756e6f6f62
console.log(buf.toString('hex'));

// 输出 cnVub29i
console.log(buf.toString('base64'));
```

从缓冲区读取数据

> buf.toString([encoding[, start[, end]]])

返回值
解码缓冲区数据并使用指定的编码返回字符串。

将 Buffer 转换为 JSON 对象

buf.toJSON()

### ArrayBuffer

> JS 中的接口

`ArrayBuffer`对象、`TypedArray`视图和`DataView`视图是 JavaScript 操作二进制数据的一个接口。

**ArrayBuffer对象**：代表内存之中的一段二进制数据，可以通过“视图”进行操作。“视图”部署了数组接口，这意味着，可以用数组的方法操作内存。

## 参考

* [Reids](http://www.cnblogs.com/wuwanyu/p/wuwanyu20160331.html)
* [post传参](http://www.cnblogs.com/wteam-xq/p/4316832.html)