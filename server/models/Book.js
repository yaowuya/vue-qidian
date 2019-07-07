const mongoose = require("mongoose");

const schema = new mongoose.Schema({
  bookId: {type: String},
  title:{type:String},
  cover:{type:String},
  author:{type:String},
  categories: [{ type: mongoose.SchemaTypes.ObjectId, ref: 'Category' }],
  lastChapter:{type:String},
  readChapter:{type:String},
  isInShelf:{type:Boolean},
  sort:{type:Boolean},
  majorCate:{type:String},
  minorCate:{type:String},
  latelyFollower:{type:Number},
  isSerial:{type:Boolean},
  retentionRatio:{type:Number},
  shortIntro:{type:String},
  longIntro:{type:String},
  ratingCount:{type:Number},
  ratingScore:{type:Number},
  wordCount:{type:Number},
  serializeWordCount:{type:Number},
  updated:{type:String},
});

module.exports = mongoose.model('Book', schema,"Books")
