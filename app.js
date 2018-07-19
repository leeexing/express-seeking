/**
 * 入口文件
 * created at 2018/07/19 by leeing
 */
const express = require('express')
const logger = require('morgan')
const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser')
const methodOverride = require('method-override')
const session = require('express-session')
const router = require('./routers')
const authCheck = require('./middleware/authCheck')
const app = express()

app.use(express.static(__dirname + '/static'))

!module.parent && app.use(logger('dev'))
app.use(cookieParser())
app.use(bodyParser.urlencoded({extended: true}))
app.use(methodOverride('_method'))

app.response.message = msg => {
  let sess = this.req.session
  sess.messages = sess.messages || []
  sess.messages.push(msg)
  return this
}
app.use(session({
  resave: false,
  saveUninitialized: false,
  secret: 'leeing - seeking'
}))

// 它的作用是对于一个路径上的所有请求加载中间件.可以做一些登陆权限验证
app.all('/api/*', authCheck)

app.use('/', router)

app.use((req, res, next) => {
  res.status(404).send(`${req.originalUrl} is 404~`)
})
app.use(function(err, req, res, next) {
  console.error(err.stack);
  res.status(500).send('Something broke!');
})

const server = app.listen(5028, _ => {
  let host = server.address().address
  let port = server.address().port
  console.log(`app is listenging at ${host}: ${port}`)
})

module.exports = app
