const mongoose = require('mongoose')

const schema = new mongoose.Schema({
  title: { type: String },
  cover: { type: String },
  author: { type: String },
  url: { type: String },
  type: { type: String },
  categories: [{ type: mongoose.SchemaTypes.ObjectId, ref: 'Category' }],
  lastChapter: { type: String },
  readChapter: { type: String },
  isInShelf: { type: Boolean },
  intro: { type: String },
  ratingScore: { type: Number },
  wordCount: { type: Number },
  updated: { type: String },
})

module.exports = mongoose.model('Book', schema, 'Books')
