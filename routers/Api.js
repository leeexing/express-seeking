/**
 * api
 */
const apiRouter = require('express').Router()
const userRouter = require('./User')

apiRouter.use('/user', userRouter)

module.exports = apiRouter