const spider = require('../../utils/loadHtml')
const cheerio = require('cheerio')

const getFisrtPageBook = async (url,cate) => {
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
    let title = el.find('.s2').text()
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
    const books = await getBookByType(nextUrl)
    return result.concat(books)
  } else {
    console.log('成功')
    return result
  }

}

module.exports = {
  getFisrtPageBook:getFisrtPageBook,
  getBookByType: getBookByType
}
