/**
 * 只是简单的模拟
 */
const mongo = require('mongodb')
const monk = require('monk')
const db = monk('localhost:27017/myblog')

const mysql = require('mysql')
const {mysqlConf} = require('./config/dbConfig')
const pool = mysql.createPool(mysqlConf)

module.exports = {
  db,
  pool
}
