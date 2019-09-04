module.exports = app => {
  const express = require('express')
  const router = express.Router({
    mergeParams: true
  })

  const utils = require('./spiderUtils')
  const nodeAsync = require('async')

  //第二种获取model方法
  const mongoose = require('mongoose')
  const book = mongoose.model('Book')
  const chapter = mongoose.model('Chapter')
  const category = mongoose.model('Category')

  const schedule=require("./schedule")
  schedule.scheduleCronstyle()

  //获取小说分类
  router.post('/category', async (req, res) => {
    const { url } = req.body
    let result = await utils.getCategory(url)
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

  router.post('/testChapter', async (req, res) => {
    // const { url, bookId } = req.body
    // chapter.deleteMany({ book: mongoose.Types.ObjectId(bookId) }).then(res => {}, err => {console.log(err)})
    // chapter.updateOne({ _id: "5d5fa671758ceab414261863", content: '' },{ content: "content" }).exec()
    let chap =await chapter.where({ _id:"5d5fa671758ceab414261863" })
    res.send(chap)
  })

  //获取章节信息
  router.post('/chapter', async (req, res) => {
    const books = await book.find()
    nodeAsync.mapLimit(books, 10, function (book, callback) {
      utils.getChapter(book, callback)
    }, function (err, result) {
      console.log('final')
      console.log(result)
    })

    res.send(books)
  })

  // 获取章节内容
  router.post('/chapter/content', async (req, res) => {
    let content=utils.updateChapterContent()
    res.send("content")
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
