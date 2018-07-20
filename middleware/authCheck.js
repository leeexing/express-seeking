/**
 * 用户权限验证
 */
const authCheck = (req, res, next) => {
  console.log('📣：Accessing the secret section ...')
  next()
}

module.exports = authCheck
