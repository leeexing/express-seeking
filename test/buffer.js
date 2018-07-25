/**
 * 测试文件
 */
const msg = {
  name: 'leeing'
}
let buff = Buffer.from(msg.name)
// let buff = new Buffer(msg.name)
console.log(buff)
// let json = buff.toJSON()
let json = buff.toString()
console.log(json)

// 这个写法我真是太喜欢了👍👍👍👍
Promise.resolve(2).then(console.log)
