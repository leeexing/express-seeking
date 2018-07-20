/**
 * 数据库基本操作
 */
const {db, pool, Redis} = require('../db')
const resHelper = require('../util/responseHelp')
const $userSql = require('../dao/userSql')
// redis 初始化
Redis.global_init()

class DBManager {
   // 获取mongodb数据
  static mongo(req, res) {
    db.get('users').find({}, (err, data) => {
      let names = data.map(item => item.username)
      res.render('index', {names})
    })
  }
  // 获取mysql数据
  static mysql(req, res) {
    pool.getConnection((err, conn) => {
      conn.query($userSql.queryAll, (_, data) => {
        if (data) {
          resHelper.returnTrue(res,{data})
        } else {
          resHelper.returnFalse(res)
        }
        // 释放连接
        conn.release()
      })
    })
  }
  static insertUser(req, res) {
    let body = req.body
    console.log(body)
    pool.getConnection((err, conn) => {
      conn.query($userSql.queryByName, body.UserName, (err, data) => {
        if (data.length) {
          resHelper.returnFalse(res, {message: '用户名已存在！'})
        } else {
          conn.query($userSql.insert, Object.values(body), (err, data) => {
            if (err) {
              resHelper.returnError(res, {message: err})
            } else {
              resHelper.returnTrue(res, {data})
            }
            conn.release()
          })
        }
      })
    })
  }
  // 获取redis数据
  static redis(req, res) {
    redisClient.get('name', (err, data) => {
      console.log(data)
      resHelper.returnTrue(res, {data})
    })
  }
  // 设置redis hash 值
  static hmset(req, res) {
    let key = req.params.key
    let value = req.body
    console.log(value)
    redisClient.hmset(key, value, err => {
      if (err) {
        return resHelper.returnError(res)
      }
      resHelper.returnTrue(res)
    })
  }
  static hmget(req, res) {
    let key = req.params.key
    redisClient.hgetall(key, (err, data) => {
      console.log(data)
      if (err) {
        return resHelper.returnError(res)
      }
      resHelper.returnTrue(res, {data})
    })
  }
}

module.exports = DBManager
