var express = require("express");
var logger = require("morgan");
var mongoose = require("mongoose");
var PORT = process.env.PORT || 3000;
var MONGODB_URI =
  process.env.MONGODB_URI || "mongodb://localhost/premireleaguedata";
mongoose.connect(MONGODB_URI, { useNewUrlParser: true });

var axios = require("axios");
var cheerio = require("cheerio");

var db = require("./models");

var app = express();

app.use(logger("dev"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));

app.get("/scrape", function(req, res) {
  axios.get("https://www.skysports.com/").then(function(response) {
    var $ = cheerio.load(response.data);

    $("h3").each(function(i, element) {
      var result = {};

      result.title = $(this)
        .children()
        .text();
      result.link = $(this)
        .children("a")
        .attr("href");
      // result.img = $(this)
      // .find("img")
      // .attr("src");

      db.Article.create(result)
        .then(function(dbArticle) {
          console.log(dbArticle);
        })
        .catch(function(err) {
          console.log(err);
        });
    });

    res.redirect("/");
  });
});

app.get("/articles", function(req, res) {
  db.Article.find({})
    .then(function(dbArticle) {
      res.json(dbArticle);
    })
    .catch(function(err) {
      res.json(err);
    });
});

app.get("/note", function(req, res) {
  db.Article.find({})
    .then(function(dbArticle) {
      res.json(dbArticle);
    })
    .catch(function(err) {
      res.json(err);
    });
});

app.get("/articles/:id", function(req, res) {
  db.Article.findOne({ _id: req.params.id })
    .populate("note")
    .then(function(dbArticle) {
      res.json(dbArticle);
    })
    .catch(function(err) {
      res.json(err);
    });
});

app.post("/articles/:id", function(req, res) {
  db.Note.create(req.body)
    .then(function(dbNote) {
      return db.Article.findOneAndUpdate(
        { _id: req.params.id },
        { note: dbNote._id },
        { new: true }
      );
    })
    .then(function(dbArticle) {
      res.json(dbArticle);
    })
    .catch(function(err) {
      res.json(err);
    });
});
app.listen(PORT, function() {
  console.log("App running on port " + PORT + "!");
});
