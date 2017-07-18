var express = require("express");
var router = express.Router();
var User = require("../models/user");
var Book = require("../models/book");

// called when a user issues a trade request
router.post("/my", (req, res) => {
  // ensure user is logged in
  if (!req.user) {
    res.render("login", {
      error_msg: "You must log in to see this page"
    });
  }
  else {
    let bookId = req.body.id;
    let userEmail = req.body.email;
    let bookName = req.body.name;

    // wrong user is trying to issue trade request on behalf of other user
    if (userEmail != req.user.email) {
      res.redirect("/books/all");
    }
    else {
      // if given book exists, issue a trade request
      Book.getBookById(bookId, (err, book) => {
        if (err) throw err;

        if (book) {
          // add to other trade request of the owner
          User.addOtherTradeRequest(bookId, bookName, book.ownerEmail, userEmail, (err, msg) => {
            if (err) throw err;
            console.log(msg);
          });

          // add to my trade request of the current user
          User.addMyTradeRequest(bookId, bookName, userEmail, book.ownerEmail, (err, msg) => {
            if (err) throw err;
            console.log(msg);
          });
          res.redirect("/books/all");
        }
      });
    }
  }
});


router.get("/myRequests", (req, res) => {
  if (!req.user) {
    res.render("login", {
      error_msg: "You must log in to see this page"
    });
  }
  else {
    
    User.getMyTradeRequests(req.user.email, (err, user) => {
      if (err) throw err;

      if (user) {
        res.render("myRequests", {
          user: user
        });
      }
    });
  }
});


router.post("/myRequests", (req, res) => {
  if (!req.user) {
    res.render("login", {
      error_msg: "You must log in to see this page"
    });
  }
  else {
    let bookId = req.body.bookId;
    let issuerEmail = req.user.email;

    User.deleteMyTradeRequest(bookId, issuerEmail, (err, msg) => {
      if (err) throw err;
      console.log(msg);
    });

    Book.getBookById(bookId, (err, book) => {
      if (err) throw err;

      if (book) {
        User.deleteOtherTradeRequest(bookId, book.ownerEmail, issuerEmail, (err, msg) => {
          if (err) throw err;
          console.log(msg);
        });    
      }
    });
    res.redirect("/trade/myRequests");
    
  }
});


router.get("/otherRequests", (req, res) => {
  if (!req.user) {
    res.render("login", {
      error_msg: "You must log in to see this page"
    });
  }
  else {
    User.getOtherTradeRequests(req.user.email, (err, user) => {
      if (err) throw err;

      if (user) {
        console.log(user);

        res.render("otherRequests", {
          user: user
        });
      }
    });
  }
});

router.post("/otherRequests", (req, res) => {
  if (!req.user) {
    res.render("login", {
      error_msg: "You must log in to see this page"
    });
  }
  else {
    let bookId = req.body.bookId;
    let issuerEmail = req.body.issuerEmail;
    let trade = req.body.trade;
    let cancel = req.body.cancel;

    // trade request accepted
    if (trade) {
      // Add book to requester's books
      User.addBook(issuerEmail, bookId, (err, msg) => {
        if (err) throw err;
        console.log(msg);
      });

      Book.addSharedUser(bookId, issuerEmail, (err, msg) => {
        if (err) throw err;
        console.log(msg);
      });

      // delete the trade request
      User.deleteMyTradeRequest(bookId, issuerEmail, (err, msg) => {
        if (err) throw err;
        console.log(msg)
      });

      User.deleteOtherTradeRequest(bookId, req.user.email, issuerEmail, (err, msg) => {
        if (err) throw err;
        console.log(msg);
      });
    }
    else {
     // delete the trade request
      User.deleteMyTradeRequest(bookId, issuerEmail, (err, msg) => {
        if (err) throw err;
        console.log(msg)
      });

      User.deleteOtherTradeRequest(bookId, req.user.email, issuerEmail, (err, msg) => {
        if (err) throw err;
        console.log(msg);
      }); 
    }

    res.redirect("/trade/otherRequests");
  }
});


module.exports = router;