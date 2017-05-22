var Comments = require("../models/Comments.js");
var News = require("../models/News.js");
var express = require("express");
var request = require('request');
var cheerio = require('cheerio');
var router = express.Router();

router.get("/", function(req, res) {
    News.find({}).populate("comments").exec(function(error, doc) {
        if (error) {
            res.send(error);
        } else {
            var articles = { data: doc };
            res.render("scrape", articles);
        }
    });
});

router.get("/scrape", function(req, res) {
    request("http://www.bbc.com/news/science_and_environment", function(error, response, html) {
        var $ = cheerio.load(html);
        $(".sparrow-item").each(function(i, element) {
            var result = {};
            result.title = $(this).find("span.title-link__title-text").text();
            result.image = $(this).find("div.js-delayed-image-load").attr("data-src");
            result.summary = $(this).find("p.sparrow-item__summary").text();
            result.link = $(this).find("div.sparrow-item__body").children("a").attr("href");
            if (!result.link.includes("http", 0)) {
                result.link = "http://www.bbc.com" + result.link;
            }
            if (result.title && result.image && result.link) {
                News.count({ link: result.link }, function(err, count) {
                    if (count === 0) {
                        var document = new News(result);
                        document.save(function(err, doc) {
                            if (err) {
                                res.send(err);
                            } else {
                                console.log("New document added");
                                res.redirect("/");
                            }
                        });
                    } else {
                        console.log("Document already exist");
                    }
                });
            }
        });
        res.redirect("/");
    });
});

router.post('/add/comment/:id', function(req, res) {
    var articleId = req.params.id;
    if (req.body.userName && req.body.userComment) {
        var result = {
            username: req.body.userName,
            message: req.body.userComment,
            news: req.params.id
        };
        var comment = new Comments(result);
        comment.save(function(err, doc) {
            if (err) {
                res.send(error);
            } else {
                News.findOneAndUpdate({ '_id': articleId }, { $push: { "comments": doc._id } }, { new: true }, function(err, newComment) {
                    if (err) {
                        res.send(err);
                    } else {
                        res.redirect("/");
                    }
                });
            }
        });
    } else {
        console.log("Empty user name OR message");
        res.redirect("/");
    }
});

router.post('/delete/comment/:id', function(req, res) {
    var commentId = req.params.id;
    Comments.findByIdAndRemove(commentId, function(err, todo) {
        if (err) {
            res.send(err);
        } else {
            res.redirect("/");
        }
    });
});

router.get("/users", function(req, res) {
    Comments.find({}).populate("news").exec(function(error, doc) {
        if (error) {
            res.send(error);
        } else {
            var users = { user: doc };
            res.render("users", users);
        }
    });
});

module.exports = router;