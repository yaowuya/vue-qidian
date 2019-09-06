const redis = require('redis')
const redisConfig = {
  host: '127.0.0.1',
  port: 6379
}
const client = redis.createClient(redisConfig.port, redisConfig.host)
client.on('connect', function () {
  console.log('connected')
})
//记录redis错误
client.on('error', function (err) {
  console.log('redis error: ' + err)
})

module.exports = client
