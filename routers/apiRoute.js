/**
 * api
 */
const apiRouter = require('express').Router()
const userRouter = require('./userRoute')
const loginRouter = require('./loginRoute')
const authCheck = require('../middleware/authCheck')

// 它的作用是对于一个路径上的所有请求加载中间件.可以做一些登陆权限验证
apiRouter.use('/', authCheck)

apiRouter.use('/user', userRouter)
apiRouter.use('/', loginRouter)

// 错误
apiRouter.use((req, res, next) => {
  res.status(404).send(`${req.originalUrl} request is 404~`)
})
apiRouter.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).send('Something broke!')
})

module.exports = apiRouter
