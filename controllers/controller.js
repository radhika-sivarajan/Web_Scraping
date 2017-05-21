var comments = require("../models/Comments.js");
var news = require("../models/News.js");

var express = require("express");
var router = express.Router();
var request = require('request');
var cheerio = require('cheerio');

router.get("/", function(req, res) {
    res.render("scrape");
});

module.exports = router;