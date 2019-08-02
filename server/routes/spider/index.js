module.exports= app => {
  const express = require("express");
  const router = express.Router({
    mergeParams: true
  });

  const spider=require("../../utils/loadHtml");
  const cheerio=require("cheerio");

  //第二种获取model方法
  const mongoose = require('mongoose');
  const book=mongoose.model("Book");
  const category = mongoose.model('Category');

  router.post("/book",async (req,res)=>{
    const {url}=req.body;
    let htmlText=await spider.fetchByUrl(url);
    console.log(url,htmlText);
    const $=cheerio.load(htmlText);
    const li_list=$("li","#newscontent");

    const result=[];
    li_list.each(function (index,element) {
      const el = $(element);
      let type=el.find(".s1").text();
      let url = el.find(".s2").children("a").attr("href");
      let title = el.find(".s2").text();
      let lastChapter=el.find(".s3").text();
      let author=el.find(".s4").text();
      result.push({
        "title":title,
        "author":author,
        "url":url,
        "type":type,
        "lastChapter":lastChapter
      });
    });
    console.log(result);

    for(let resData of result){
      await book.create(resData);
    }

    res.send(result);
  })

  app.use("/admin/api/spider",router);
  // 错误处理函数
  app.use(async (err, req, res, next) => {
    // console.log(err)
    res.status(err.statusCode || 500).send({
      message: err.message
    })
  })
}
