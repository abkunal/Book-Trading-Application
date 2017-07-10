var mongoose = require("mongoose");

var BookSchema = mongoose.Schema({
  id: {type: String, unique: true, index: true},
  name: String,
  image: String,
  owner: String,
  ownerEmail: String
});

Book = module.exports = mongoose.model("Book", BookSchema);

module.exports.addBook = (newBook, callback) => {
  newBook.save(callback);
}

module.exports.getBookById = (id, callback) => {
  Book.findOne({id: id}, callback);
}