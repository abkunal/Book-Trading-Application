var express = require("express");
var router = express.Router();

// Homepage request
router.get("/", (req, res) => {
  res.render("index");
});


module.exports = router;