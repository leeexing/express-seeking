/**
 * 数据库操作路由
 */
const dbRouter = require('express').Router()
const DBManager = require('../controllers/dbManager')

dbRouter.get('/mongo', DBManager.mongo)

dbRouter.get('/mysql', DBManager.mysql)
dbRouter.post('/mysql/user', DBManager.insertUser)

dbRouter.get('/redis', DBManager.redis)
dbRouter.get('/redis/hash/:key', DBManager.hmget)
dbRouter.post('/redis/hash/:key', DBManager.hmset)

module.exports = dbRouter
