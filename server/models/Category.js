const mongoose = require("mongoose")

const schema = new mongoose.Schema({
    name: {type: String},
    url:{type:String},
    bookCount:{type:Number,default:0}
})

module.exports = mongoose.model('Category', schema,"Categories")
