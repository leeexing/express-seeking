/**
 * 路由主文件
 */
const mainRouter = require('express').Router()
const apiRouter = require('./apiRoute')

// 根路由
mainRouter.get('/', (req, res) => {
  res.render('index', names=['lee', 'ing'])
  // res.send('Welcome to SEEKING 😊')
})

// 接口路由
mainRouter.use('/api', apiRouter)

module.exports = mainRouter
