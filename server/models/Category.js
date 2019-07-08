const mongoose = require("mongoose")

const schema = new mongoose.Schema({
    name: {type: String},
    parent: {type: mongoose.SchemaTypes.ObjectId, ref: "Category"},
    level:{type:String},
    bookCount:{type:Number,default:0}
})

schema.virtual('children', {
    localField: '_id',// 内键，Category模型的id字段
    foreignField: 'parent',// 外键，关联模型的category字段
    justOne: false,// 只查询一条数据
    ref: 'Category' // 关联的模型
})

module.exports = mongoose.model('Category', schema,"Categories")
