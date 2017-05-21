var express = require("express");
var bodyParser = require("body-parser");
var exphbs = require("express-handlebars");
var logger = require("morgan");
var mongoose = require("mongoose");
var Promise = require("bluebird");

var PORT = process.env.PORT || 3000;
var app = express();

// Controllers
var routes = require("./controllers/controller.js");
app.use("/", routes);

// Static directory
app.use(express.static("public"));

// Handlebars
app.engine('handlebars', exphbs({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');

app.use(logger("dev"));
app.use(bodyParser.urlencoded({ extended: false }));

// Database configuration with mongoose, errors, success
mongoose.Promise = Promise;
if (process.env.NODE_ENV == 'production') {
    mongoose.connect('mongodb://heroku_309mccdx:rf05t6gjulsqo2gq5idmcbc4ng@ds149481.mlab.com:49481/heroku_309mccdx');
} else {
    mongoose.connect('mongodb://localhost/web-scraper');
}
var db = mongoose.connection;
db.on("error", function(error) { console.log("Mongoose Error: ", error); });
db.once("open", function() { console.log("Mongoose connection successful."); });

app.listen(PORT, function() {
    console.log('Running on port: ' + PORT);
});