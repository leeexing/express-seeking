/**
 * 将请求和错误信息写入标准错误输出、日志
 */
const logErrors = (err, req, res, next) => {
  console.log(err.stack)
  next()
}

const clientErrorHandler = (err, req, req, next) => {
  if (req.xhr) {
    res.status(500).send({error: 'something blew up!'})
  } else {
    next(err)
  }
}

const errorHandler = (err, req, res, next) => {
  if (res.headersSent) {
    return next(err)
  }
  res.status(500);
  res.render('error', { error: err })
}

module.exports = {
  logErrors,
  clientErrorHandler,
  errorHandler
}
