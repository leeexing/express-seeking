/**
 * 用户路由
 */
const userRouter = require('express').Router()

userRouter.get('/', (req, res) => {
  res.send('get user')
})

userRouter.get('/about', (req, res) => {
  res.send('get user about')
})

module.exports = userRouter


