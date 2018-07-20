/**
 * created at 2018/07/19 by leeing
 */
const express = require('express')
const logger = require('morgan')
const favicon = require('serve-favicon')
const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser')
const methodOverride = require('method-override')
const errorHandler = require('errorhandler')
const session = require('express-session')
const router = require('./routers')
const db = require('./db')
const app = express()

app.use(express.static(__dirname + '/static'))
app.use(favicon(__dirname + '/static/favicon.ico'))
app.set('port', process.env.PORT || 5028)
app.set('views', './views')
app.set('view engine', 'ejs')

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

app.use('/', router)
// 在路由之后加载
if ('development' === app.get('env')) {
  app.use(errorHandler())
}

const server = app.listen(app.get('port'), _ => {
  let host = server.address().address
  console.log(`app is listenging at ${host}: ${app.get('port')}`)
})

module.exports = app
