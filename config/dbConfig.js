/**
 * 数据库配置
 */

// 🚩本地数据库
const mysqlConf = {
  host: '127.0.0.1',
  user: 'root',
  password: '123456',
  database: 'flask',
  port: 3306
}

// ⛽远程数据库
const mysqlConf_R = {
  host: '10.13.62.202',
  user: 'root',
  password: '123456',
  database: 'emdp',
  port: 3306
}

module.exports = {
  mysqlConf,
  mysqlConf_R
}