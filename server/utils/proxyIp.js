const request = require('superagent')
const charset = require('superagent-charset')
charset(request)
const cheerio = require('cheerio')
const nodeAsync = require('async')
const client = require('../redis/redis')

const getIp = async function () {
  let res = await request('GET', 'https://www.xicidaili.com/nn/').buffer(true).charset('utf-8')
  const $ = cheerio.load(res.text)
  const list = $('tr', '#ip_list')
  let ipList = []
  list.each(function (index, element) {
    const el = $(element)
    const td = el.find('td')
    if (td.length > 0) {
      const ip = td.eq(1).text().trim()
      const port = td.eq(2).text().trim()
      const address = td.eq(3).text()
      const type = td.eq(5).text()
      const speed = Number(td.eq(6).find('.bar_inner').attr('style').replace(/[^\d]/g, ''))
      if (speed > 90) {
        ipList.push({
          ip,
          port,
          address,
          type,
          speed
        })
      }
    }
  })

  nodeAsync.mapLimit(ipList, 20, function (ip, callback) {
    testSpeed(ip, callback)
  }, function (err, result) {
    let ipArray=[]
    for (let res of result) {
      if (res != '') {
        ipArray.push(res)
      }
    }
    client.set("ips",JSON.stringify(ipArray))
    client.get("ips",function (err,v) {
      console.log(v)
    })
  })

}
const testSpeed = function (item, callback) {
  const { ip, port, type } = item
  const protocol = type.toLowerCase()
  const proxyUrl = `${protocol}://${ip}:${port}`
  const testUrl = 'https://www.baidu.com'
  const time = Date.now()
  request.get(testUrl)
    .timeout({ response: 5000, deadline: 60000 }).proxy(proxyUrl).buffer(true).charset('gbk').end((err, res) => {
    if (err) {
      callback(null, '')
    } else {
      const speed = Date.now() - time
      callback(null, proxyUrl)
    }
  })
}

module.exports = {
  getIp: getIp
}
