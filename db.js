/**
 * 只是简单的模拟
 */
// 🌝MongoDB
const mongo = require('mongodb')
const monk = require('monk')
const db = monk('localhost:27017/myblog')

// 🌜mySQL
const mysql = require('mysql')
const {mysqlConf, mysqlConf_R} = require('./config/dbConfig')
const pool = mysql.createPool(mysqlConf)
// const pool = mysql.createPool(mysqlConf_R)

// 🌞Redis
const redis = require('redis')

class Redis {
  static global_init() {
    global.redisClient = redis.createClient()
  }
  static local_init() {
    const redisClient = redis.createClient()
    redisClient.on('error', err => {
      console.log('Error: ' + err)
    })
    return redisClient
  }
}

module.exports = {
  db,
  pool,
  Redis
}
