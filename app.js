var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var exphbs = require('express-handlebars');
var expressValidator = require('express-validator');
var flash = require('connect-flash');
var session = require('express-session');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var mongo = require('mongodb');
var mongoose = require('mongoose');

mongoose.connect("mongodb://localhost/bookTrade");
var db = mongoose.connection;

// Routes come here
var index = require("./routes/index");
var users = require("./routes/users");
var settings = require("./routes/settings");
var books = require("./routes/books");
var addBook = require("./routes/addBook");
var getBook = require("./routes/getBook");

// Init App
var app = express();

// view engine
app.set("views", path.join(__dirname, "views"));
app.engine("handlebars", exphbs({"defaultLayout": "layout"}));
app.set("view engine", "handlebars");

// Body Parser Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());

// Set Static folder
app.use(express.static(path.join(__dirname, "public")));

// Express Session
app.use(session({
    secret: "secret",
    saveUninitialized: true,
    resave: true
}));

// Passport init
app.use(passport.initialize());
app.use(passport.session());

// Express Validator
app.use(expressValidator({
  errorFormatter: function(param, msg, value) {
      var namespace = param.split('.')
      , root    = namespace.shift()
      , formParam = root;

    while(namespace.length) {
      formParam += '[' + namespace.shift() + ']';
    }
    return {
      param : formParam,
      msg   : msg,
      value : value
    };
  }
}));

// Connect Flash
app.use(flash());

// Global Vars
app.use(function(req, res, next) {
  res.locals.success_msg = req.flash("success_msg");
  res.locals.error_msg = req.flash("error_msg");
  res.locals.error = req.flash("error");
  res.locals.user = req.user || null;
  next();
});

// Homepage
app.use("/", index);
app.use("/users", users);
app.use("/settings", settings);
app.use("/books", books);
app.use("/add", addBook);
app.use("/getBook", getBook);

// handle page not found
app.use(function(req, res) {
  res.render("404");
});

app.set("port", 3000);

app.listen(app.get("port"), function() {
    console.log("Server is running at port: ", app.get("port"));
});