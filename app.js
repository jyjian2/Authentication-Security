//jshint esversion:6
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs")
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const saltRounds = 10;
require('dotenv').config();

const app = express();

mongoose.connect("mongodb://127.0.0.1:27017/userDB");

const userSchema = new mongoose.Schema({
  email: String,
  password: String
});

const User = mongoose.model("user", userSchema);

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(express.static("public"));

app.get("/", function(req, res){
  res.render("home");
})

app.get("/login", function(req, res){
  res.render("login");
})

app.get("/register", function(req, res){
  res.render("register");
})

app.post("/register", function(req, res){
  bcrypt.hash(req.body.password, saltRounds, function(err, hash) {
    const newUser = new User({
      email: req.body.username,
      password: hash
    })
    newUser.save(function(err){
      if (!err) {
        res.render("secrets");
      } else {
        res.send(err);
      }
    });
});
});

app.post("/login", function(req, res){
  const userName = req.body.username;
  const password = req.body.password;
  User.findOne({email: userName}, function(err, foundUser){
    if (foundUser) {
      bcrypt.compare(password, foundUser.password, function(err, result) {
        if (!err) {
          if (result === true) {
            res.render("secrets");
          } else {
            res.send("Wrong Password");
          }
        } else {
          res.send(err);
        }
    });
    } else {
      res.send("Incorrect email or password");
    }
  })
});

app.listen(3000, function() {
  console.log("Server started on port 3000");
});
