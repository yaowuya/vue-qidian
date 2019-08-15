module.exports = app => {
  const express = require('express')
  const router = express.Router({
    mergeParams: true
  })

  const spider = require('../../utils/loadHtml')
  const cheerio = require('cheerio')
  const utils = require('./spiderUtils')

  //第二种获取model方法
  const mongoose = require('mongoose')
  const book = mongoose.model('Book')
  const chapter = mongoose.model('Chapter')
  const category = mongoose.model('Category')

  //获取小说分类
  router.post('/category', async (req, res) => {
    const { url } = req.body
    let htmlText = await spider.fetchByUrl(url)
    const $ = cheerio.load(htmlText)

    const li_list = $('li', '.nav')
    let result = []
    li_list.each(function (index, element) {
      const el = $(element)
      result.push({
        'name': el.text().replace(/小说/i, ''),
        'url': url + el.children('a').attr('href'),
        'bookCount': 0
      })
    })

    for (let resData of result) {
      await category.create(resData)
    }

    res.send(result)
  })

  //从数据库中获取分类信息
  router.get('/category', async (req, res) => {

  })

  //获取书籍
  router.post('/book', async (req, res) => {
    const { url, type, cate } = req.body
    let result = []
    if (type == '笔趣阁') {
      result = await utils.getFisrtPageBook(url, cate)
    } else {
      result = await utils.getBookByType(url, type, cate)
    }
    // console.log(result);
    for (let resData of result) {
      await book.create(resData)
    }
    res.send(result)
  })

  //获取章节内容
  router.post('/chapter', async (req, res) => {
    const { url } = req.body
    let htmlText = await spider.fetchByUrl(url)
    const $ = cheerio.load(htmlText)

    const dt_list = $('dl', '#list').eq(0).children()
    let dt = false
    let result = []
    let order = 1
    dt_list.each(async function (index, element) {
      const el = $(element)
      if (el.text() == '正文') {
        dt = true
      }
      if (dt) {
        let href = el.children('a').attr('href')
        let htmlContent = await spider.fetchByUrl(url + href.split('\/')[2])
        const ch = cheerio.load(htmlContent, { decodeEntities: false })
        await chapter.create({
          'name': el.text(),
          'book': '5d440b66e999ed40cc7b04f1',
          'url': href.split('\/')[2],
          'order': order,
          'content': ch('#content').html(),
        })
        result.push({
          'name': el.text(),
          'book': '5d440b66e999ed40cc7b04f1',
          'url': href.split('\/')[2],
          'order': order,
          'content': ch('#content').html(),
        })
        order++
      }
    })
    res.send(result)
  })

  app.use('/admin/api/spider', router)
  // 错误处理函数
  app.use(async (err, req, res, next) => {
    // console.log(err)
    res.status(err.statusCode || 500).send({
      message: err.message
    })
  })
}
