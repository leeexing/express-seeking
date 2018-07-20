/**
 * 接口返回帮助类
 */
class ResponseHelper {
  static returnTrue(res, {message='success 😜', status=200, data=null} = {}) {
    return res.send({
      success: true,
      message,
      status,
      data
    })
  }
  static returnFalse(res, {message='failure 🤣', status=200, data=null} = {}) {
    return res.send({
      success: false,
      message,
      status,
      data
    })
  }
  static returnError(res, {message='Server Error 🤬', status=500, data=null} = {}) {
    return res.send({
      success: false,
      message,
      status,
      data
    })
  }
}

module.exports = ResponseHelper
