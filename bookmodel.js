
const mongoose = require('mongoose');

// Book Schema
const bookSchema = new mongoose.Schema({
  title:       { type: String, required: true },
  author:      { type: String, required: true },
  description: { type: String },
  user:        { type: mongoose.Schema.Types.ObjectId, ref: "User"},
});


const Book = mongoose.model('Book', bookSchema);

module.exports={Book}
