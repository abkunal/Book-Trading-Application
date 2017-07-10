/* Returns a json  */

var express = require("express");
var router = express.Router();
var Book = require("../models/book");

router.use("/", (req, res) => {
  if (!req.user) {
    res.end("{error: 'not logged in'}");
  }
  else {
    let id = req.url.substring(1, req.url.length);

    console.log(id);

    Book.getBookById(id, (err, book) => {
      if (err) throw err;

      console.log(book);
      if (book) {
        let name = book.name;
        let image = book.image;
        let bookData = JSON.stringify({name: name, image: image});

        res.end(bookData);
      }
      else {
        res.end("{error: 'Wrong id'}");
      }
    });
  }
});


module.exports = router;