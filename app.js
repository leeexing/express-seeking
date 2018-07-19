/**
 * 入口文件
 * created at 2018/07/19 by leeing
 */
const express = require('express')
const logger = require('morgan')
const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser')
const app = express()

app.use(express.static(__dirname + '/static'))

app.use(logger('dev'))
app.use(cookieParser())
app.use(bodyParser.urlencoded({extended: true}))

app.get('/', (req, res) => {
  res.send('This is my house')
})
app.get('/users', (req, res) => {
  let users = [
    {name: 'james', age: 23},
    {name: 'kobe', age: 24},
    {name: 'leekinm', age: 25},
  ]
  res.send(users)
})

const server = app.listen(5028, _ => {
  let host = server.address().address
  let port = server.address().port
  console.log(`app is listenging at ${host}: ${port}`)
})
