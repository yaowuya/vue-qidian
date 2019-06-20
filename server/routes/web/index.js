module.exports = app => {
    const router = require('express').Router()

    //第二种获取model方法
    const mongoose = require("mongoose")
    const Category = mongoose.model("Category")

    app.use('/web/api', router)
}


