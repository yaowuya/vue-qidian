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
    let result =await utils.getChapter(url)
    for (let resData of result) {
      await category.create(resData)
    }
    res.send(result)
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
    const { url, bookId } = req.body
    const chapters =await utils.getChapterContent(url,bookId)

    let bookInfo = chapters.bookInfo
    await book.findByIdAndUpdate(bookId, bookInfo)

    let chapts=await chapter.deleteMany({book:mongoose.Types.ObjectId(bookId)})

    let result = chapters.result
    result.forEach(async function (value,index) {
      let htmlContent = await spider.fetchByUrl(value.url)
      let ch = cheerio.load(htmlContent, { decodeEntities: false })
      value.content=ch("#content").html()
      await chapter.create(value)
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
