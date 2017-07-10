var mongoose = require("mongoose");
var bcrypt = require("bcryptjs");

var UserSchema = mongoose.Schema({
  name: String,
  email: {type: String, unique: true, index: true},
  password: String,
  city: String,
  state: String,
  myBooks: [String],            // will contain id of the book
  myTradeRequest: [String],     // add the book to my myTradeRequest and owner's otherTradeRequest
  otherTradeRequest: [String]   
});

User = module.exports = mongoose.model("bookUser", UserSchema);

// add/register a new user to the database
module.exports.createUser = (newUser, callback) => {
  bcrypt.genSalt(10, function(err, salt) {
    bcrypt.hash(newUser.password, salt, function(err, hash) {
      newUser.password = hash;
      newUser.save(callback);
    });
  });
}

// add a book to user's myBooks
module.exports.addBook = (email, bookId, callback) => {
  User.update({email: email}, {$push: {myBooks: bookId}}, callback);
}

// get user information by email
module.exports.getUserByEmail = (email, callback) => {
  let query = {email: email};
  User.findOne(query, callback);
}

// update details of a user
module.exports.updateDetails = (email, details, callback) => {
  User.update(
    {email: email}, 
    {name: details.name, city: details.city, state: details.state}, 
    callback);
}

// compare password for login and password change
module.exports.comparePassword = function(candidatePassword, hash, callback) {
  bcrypt.compare(candidatePassword, hash, function(err, isMatch) {
    if (err) throw err;
    callback(null, isMatch);
  });
}

// change given user's password
module.exports.changePassword = (email, newPass, callback) => {
  User.findOne({email: email}, (err, user) => {
    if (err) throw err;

    if (user) {
      bcrypt.genSalt(10, function(err, salt) {
        bcrypt.hash(newPass, salt, function(err, hash) {
          User.update({email: email}, {password: hash}, callback);
        });
      });
    }
  });
}

