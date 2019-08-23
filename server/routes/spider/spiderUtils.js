const spider = require('../../utils/loadHtml')
const cheerio = require('cheerio')
const mongoose = require('mongoose')
const book = mongoose.model('Book')
const chapter = mongoose.model('Chapter')
//获取书籍分类
const getCategory = async (url) => {
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
  return result
}
//获取首页书籍
const getFisrtPageBook = async (url, cate) => {
  let htmlText = await spider.fetchByUrl(url)
  // console.log(url,htmlText);
  const $ = cheerio.load(htmlText)
  const li_list = $('li', '#newscontent .l')

  let result = []
  li_list.each(function (index, element) {
    const el = $(element)
    let type = el.find('.s1').text()
    let url = el.find('.s2').children('a').attr('href')
    let title = el.find('.s2').text()
    let lastChapter = el.find('.s3').text()
    let author = el.find('.s4').text()
    result.push({
      'title': title,
      'author': author,
      'url': url,
      'type': type,
      'lastChapter': lastChapter,
      'categories': cate
    })
  })

  return result
}
//根据书籍类型获取书籍
const getBookByType = async (url, type, cate) => {
  let htmlText = await spider.fetchByUrl(url)
  // console.log(url,htmlText);
  const $ = cheerio.load(htmlText)
  const li_list = $('li', '#newscontent .l')
  const nextPage = $('#newscontent .page_b .next')

  let result = []
  li_list.each(function (index, element) {
    const el = $(element)
    let url = el.find('.s2').children('a').attr('href')
    let title = el.find('.s2').text().replace(/《/, '').replace(/》/, '')
    let lastChapter = el.find('.s3 a').text()
    let author = el.find('.s5').text()
    result.push({
      'title': title,
      'author': author,
      'url': url,
      'type': type,
      'lastChapter': lastChapter,
      'categories': cate
    })
  })
  // console.log(nextPage);
  if (nextPage.length > 0) {
    const nextUrl = nextPage.attr('href')
    console.log(nextUrl)
    const books = await getBookByType(nextUrl, type, cate)
    return result.concat(books)
  } else {
    console.log('成功')
    return result
  }

}

//获取章节信息
const getChapterDetail = async (url, bookId) => {
  let htmlText = await spider.fetchByUrl(url)
  const $ = cheerio.load(htmlText)

  const cover = $('img', '#fmimg')
  const maininfo = $('#maininfo')
  let bookInfo = {
    cover: cover.attr('src'),
    intro: maininfo.find('#intro p').text(),
    updated: maininfo.find('#info p').eq(2).text().replace(/最后更新：/i, '')
  }

  const dt_list = $('dl', '#list').eq(0).children()
  let dt = false
  let result = []
  let order = 1

  dt_list.each(function (index, element) {
    const el = $(element)
    if (el.text() == '正文') {
      dt = true
    }
    if (dt) {
      let href = el.children('a').attr('href')
      if (href != undefined) {
        let hrefUrl = href.split('\/')[2]
        if (hrefUrl.indexOf('html') > -1) {
          result.push({
            'name': el.text(),
            'book': bookId,
            'url': url + hrefUrl,
            'order': order,
            'content': ''
          })
          order++
        }
      }
    }
  })
  return {
    bookInfo: bookInfo,
    result: result
  }
}

const getChapter = function (bookItem, callback) {
  const url = bookItem.url
  const bookId = bookItem._id
  let cha = getChapterDetail(url, bookId)
  cha.then(data => {
    let bookInfo = data.bookInfo
    book.findByIdAndUpdate(bookId, bookInfo).then(res=>{},err=>{console.log(err)})
    chapter.deleteMany({ book: mongoose.Types.ObjectId(bookId) }).then(res=>{},err=>{console.log(err)})

    let result = data.result
    for (let resData of result) {
      chapter.create(resData)
    }
    let delay = parseInt((Math.random() * 10000000) % 2000, 10)
    setTimeout(function () {
      callback(null, result)
    }, delay)
  }).catch(err => {
    console.log(err)
  })
}

module.exports = {
  getCategory: getCategory,
  getFisrtPageBook: getFisrtPageBook,
  getBookByType: getBookByType,
  getChapterDetail: getChapterDetail,
  getChapter: getChapter
}
