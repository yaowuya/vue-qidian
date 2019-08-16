const mongoose=require("mongoose");

const schema = new mongoose.Schema({
  name: { type: String },
  book: { type: mongoose.SchemaTypes.ObjectId, ref: 'Book' },
  url: { type: String },
  order: { type: Number },
  content: { type: String },
})

module.exports = mongoose.model('Chapter', schema, 'Chapters')
