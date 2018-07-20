/**
 * 用户业务管理
 */
const {db} = require('../db')
const resHelper = require('../util/responseHelp')
const users = [
  { id: 1, name: 'James', team: 'Cavaliers'},
  { id: 2, name: 'Kobe', team: 'Lakers'},
  { id: 3, name: 'leeing', team: 'NSTS'},
]

class UserManager {
  static getUser(req, res) {
    let id = req.params.id
    if (id == 0) {
      db.get('user').find({}, (err, data) => {
        if (data) {
          resHelper.returnTrue(res, {data})
        }
      })
    } else {
      if (id > users.length) {
        return res.send('暂无数据')
      }
      res.send(users[id] ? users[id] : '暂无数据')
    }
  }
  static putUser(req, res) {
    let id = req.params.id
    if (id == 0) {
      return res.send('参数错误')
    } else {
      if (id > users.length) {
        return res.send('暂无数据')
      }
      users[id].put = '我修改了哈 ' + new Date()
      res.send(users[id])
    }
  }
  static deleteUser(req, res) {
    let id = req.params.id
    if (id > users.length) {
      return res.send('哈哈，有点大')
    }
    delete users[id]
    res.send('用户数据删除成功')
  }
}

module.exports = UserManager
