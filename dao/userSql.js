/**
 * 用户查询语句
 */
const user = {
  insert: 'insert into user(UserName, Password, Name) values(?, ?, ?);',
  update: 'update user set Name=? where id=?;',
  delete: 'delete from user where id=?;',
  queryById: 'select * from user where id=?;',
  queryByName: 'select * from user where UserName=?;',
  queryAll: 'select * from user;'
}

module.exports = user
