# Knight

## 如何使用Redis

* 方法一：将redisClient存储在node的全局对象global中
* 方法二： 将redis初始化方法，封装在index.js中，然后exports出去

## post传参

使用postman的时候，注意 body 的类型。不要使用 form-data
可以是 `x-www-form-urlencoded` 或者 raw 的 `application/json`

### 参考

* [Reids](http://www.cnblogs.com/wuwanyu/p/wuwanyu20160331.html)
* [post传参](http://www.cnblogs.com/wteam-xq/p/4316832.html)