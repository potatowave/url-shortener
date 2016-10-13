// Required Frameworks

const express = require("express");
const randStr = require("./randomstring");
const app = express();

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

// Routing

// respond to gets from /urls

app.get("/urls/new", (req, res) => {
  res.render("urls_new");
});

app.get("/urls/:id", (req, res) => {
  let templateVars = { shortURL: req.params.id, urlDatabase};
  console.log(req.params.id);
  res.render("urls_view", templateVars);
});

// respond to gets from /urls/new (serves form)

// resond to posts from /urls
let urls = { urls: urlDatabase }
app.get("/urls", (req, res) => {
  res.render("urls_index", urls);
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
  res.render("urls_view");

});

app.get("/u/:shortURL", (req, res) => {
  //console.log(req.params.shortURL);
  let short = req.params.shortURL;
  let longURL = urlDatabase[short];
  if (longURL !== undefined) {
    res.redirect(301, longURL);
  } else {
    console.log("Incoming Request to unknown redirect")
  }

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
  // console.log(req.body.longURL);  // debug statement to see POST parameters
  //res.send("Ok");         // Respond with 'Ok' (we will replace this)
  let id = req.params.id;
  console.log(req.body.newURL);
  urlDatabase[id] = req.body.newURL;
  res.redirect(301, /urls/);

});

// Tell the console the server is running

app.listen(PORT, () => {
  console.log(`Web Server listening on port ${PORT}!`);
});