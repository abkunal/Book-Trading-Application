var express = require("express");
var router = express.Router();
var Book = require("../models/book");
var User = require("../models/user");


router.post("/", (req, res) => {
  if (!req.user) {
    res.render("login", {
      error_msg: "You must log in to access this page"
    });
  }
  else {
    console.log(req.body.title, req.body.id, req.body.image);
    console.log(req.body);

    // get book data
    let name = req.body.name;
    let id = req.body.id;
    let image = req.body.image;
    let owner = req.user.name;
    let ownerEmail = req.user.email;

    Book.getBookById(id, (err, book) => {
      if (err) throw err;

      if (book) {
        res.end("exist");
      }
      else {
        // create a new book record
        var newBook = Book({
          name: name,
          image: image,
          id: id,
          owner: owner,
          ownerEmail: ownerEmail
        });

        // add the book to books collection
        Book.addBook(newBook, (err, msg) => {
          if (err) throw err;
          console.log(msg);
        });

        // add book to user's records
        User.addBook(ownerEmail, id, (err, msg) => {
          if (err) throw err;
          console.log(msg);
        });

        res.end("success");
      }
    });

      


  }
});


module.exports = router;