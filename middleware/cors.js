/**
 * 设置代理
 * 跨域
 */
const trustProxy = ip => {
  if (ip === '127.0.0.1' || ip === '132.232.18.77') {
    return true
  } else {
    return false
  }
}

module.exports = trustProxy
