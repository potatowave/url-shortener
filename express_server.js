// Required Frameworks

const express = require("express");
const randStr = require("./randomstring");
const app = express();
const Cookies = require('cookies');
const KeyGrip = require("keygrip")
const keys = new KeyGrip(['samsung note 7', 'iphone 7'], 'sha256')

// Configuration

var PORT = process.env.PORT || 8080; // default port 8080
app.set('view engine', 'ejs'); // Set View Engine to ejs

// Run time data

var urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

// Middleware

const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded());

app.use((req, res, next) => {
  req.cookies = new Cookies( req, res, { "keys": keys } )
  next();
})

// Routing

// respond to gets from /urls

app.get("/urls/new", (req, res) => {
  let templateVars = { shortURL: req.params.id, username: req.cookies.get("username"), urlDatabase};
  res.render("urls_new", templateVars);
});

app.get("/urls/:id", (req, res) => {
  let templateVars = { shortURL: req.params.id, username: req.cookies.get("username"), urlDatabase};
  console.log(req.params.id);
  res.render("urls_view", templateVars);
});

// respond to gets from /urls/new (serves form)

// resond to posts from /urls

app.get("/urls", (req, res) => {
  let templateVars = { urls: urlDatabase, username: req.cookies.get("username") }
  res.render("urls_index", templateVars);
});

app.post("/urls", (req, res) => {
  // console.log(req.body.longURL);  // debug statement to see POST parameters
  //res.send("Ok");         // Respond with 'Ok' (we will replace this)
  const tinyString =  String(randStr());
  urlDatabase[tinyString] = req.body.longURL;
  console.log(urlDatabase);
  res.redirect('urls/' + tinyString);

});

app.get("/url/:shortURL", (req, res) => {
  let templateVars = { urls: urlDatabase, username: req.cookies.get("username") }
  res.render("urls_view", templateVars);

});


app.get("/u/:shortURL", (req, res) => {
  //console.log(req.params.shortURL);
  let short = req.params.shortURL;
  let longURL = urlDatabase[short];
  if (longURL !== undefined) {
    res.redirect(301, longURL);
  } else {
    console.log("Incoming Request to unknown redirect " + short);
  }

});

app.post("/login", (req, res) => {

  let userName = req.body.username;
  req.cookies.set("username", userName);
  res.redirect("/urls/");
  console.log(userName);

});

app.post("/urls/:id/delete", (req, res) => {
  // console.log(req.body.longURL);  // debug statement to see POST parameters
  //res.send("Ok");         // Respond with 'Ok' (we will replace this)
  let id = req.params.id;
  delete urlDatabase[id];
  console.log("Something was just deleted." + urlDatabase);
  res.redirect(301, /urls/);

});

app.post("/urls/:id", (req, res) => {

  let id = req.params.id;
  console.log(req.body.newURL);
  urlDatabase[id] = req.body.newURL;
  res.redirect(301, /urls/);

});

// Tell the console the server is running

app.listen(PORT, () => {
  console.log(`Web Server listening on port ${PORT}!`);
});