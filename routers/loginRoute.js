/**
 * 登录注册路由
 */
const loginRouter = require('express').Router()

loginRouter.get('/userinfo', (req, res) => {
  res.append('Set-Cookie', '');
  // res.append('Set-Cookie', 'foo=bar; Path=/; HttpOnly');
  res.cookie('leekinm', 'baidu', {path: '/fontend', expires: new Date(Date.now() + 3600*24*2*1000), httpOnly: true})
  res.send('users')
})

loginRouter.post('/login', (req, res) => {
  res.send('登录成功')
})

loginRouter.post('/logout', (req, res) => {
  res.send('退出成功')
})

loginRouter.post('/register', (req, res) => {
  res.send('新用户注册成功')
})

module.exports = loginRouter
