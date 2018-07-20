/**
 * 用户模型
 */
/**
 * 用户 表结构
 */
const mongoose = require('mongoose')
const Schema = mongoose.Schema

const UserSchema = new Schema({
  username: String,
  password: String,
  avatar: {
    type: String,
    default: 'http://p7f6fz0hn.bkt.clouddn.com/my-python-logo.png'
  },
  isAdmin: {
    type: Boolean,
    default: false
  },
  motto: String,
  signature: String, // 签名
  tags: [],
  email: {
    type: String,
    default: ''
  },
  permissions: { // 权限
    type: Number,
    default: 1
  },
  follows: [
    {
      followName: String,
      followAvatar: String
    }
  ],
  todos: [{  // 一对多的关系
    type: Schema.Types.ObjectId,
    ref: 'Todolist'
  }]
})

mongoose.model('User', UserSchema)
