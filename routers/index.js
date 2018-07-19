/**
 * 路由主文件
 */
const mainRouter = require('express').Router()
const apiRouter = require('./Api')

// haha
mainRouter.get('/', (req, res) => {
  res.send('Welcome to SEEKING 😊')
})

mainRouter.use('/api', apiRouter)

module.exports = mainRouter
