const request = require('superagent')
const charset = require('superagent-charset')
const proxy = require('superagent-proxy')
charset(request)
proxy(request)

const userAgents = require('./userAgent')

async function fetchByUrl (url) {
  // let res=await request("GET",url).buffer(true).charset("gbk");
  // http://222.184.7.206:43327
  let userAgent = userAgents[parseInt(Math.random() * userAgents.length)]
  let res = await request('GET', url).set({ 'User-Agent': userAgent }).proxy('http://120.78.186.233:8080').buffer(true).charset('gbk')
  return res.text
}

module.exports = {
  fetchByUrl,
}
