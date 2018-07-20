/**
 * 用户路由
 */
const userRouter = require('express').Router()
const UserManager = require('../controllers/userManager')

userRouter.get('/mongo', UserManager.mongo)

userRouter.get('/mysql', UserManager.mysql)

userRouter.get('/:id', UserManager.getUser)

userRouter.put('/:id', UserManager.putUser)

userRouter.delete('/:id', UserManager.deleteUser)

module.exports = userRouter
