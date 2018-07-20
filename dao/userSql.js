/**
 * 用户查询语句
 */
const user = {
  insert: 'insert into user(id, UserName, Name, Password) values(0, ?, ?, ?);',
  update: 'update user set Name=? where id=?;',
  delete: 'delete from user where id=?;',
  queryById: 'select * from user where id=?;',
  queryAll: 'select * from user;'
}

module.exports = user
