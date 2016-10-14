// Required Frameworks

const express = require("express");
const randStr = require("./randomstring");
const app = express();
const Cookies = require('cookies');
const KeyGrip = require("keygrip")
const keys = new KeyGrip(['samsung note 7', 'iphone 7'], 'sha256')
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded());

// Configuration

var PORT = process.env.PORT || 8080; // default port 8080
app.set('view engine', 'ejs'); // Set View Engine to ejs

// Run time data

var urlDatabase = {
            "b2xVn2": { longURL: "http://www.lighthouselabs.ca", userid: "3k3k33" },
            "9sm5xK": { longURL: "http://www.google.com", userid: "3k3k33" } ,
            "3fkf0d": { longURL: "http://www.frogs.com", userid: "3k3k33" } };

var users = { "3k3k33": { id: "3k3k33",  email: "kinetic@icloud.com", password: "lighthouse"} };

// Middleware

app.use((req, res, next) => {
  req.cookies = new Cookies( req, res, { "keys": keys } );
  next();


});

// Routing

// respond to gets from /urls

app.post("/urls/register", (req, res) => {

  const id =  String(randStr());
  console.log(JSON.stringify(req.body));
  let email = req.body.email;
  let password = req.body.password;

  if (!email) {
    res.sendStatus(400);
    return;
  }

  if (!password) {
    res.sendStatus(400);
    return;
  } else {


    users[id] = { id: id, email: email , password: password };
    req.cookies.set("userid", id);
    res.redirect('/urls');

  }

});


app.get("/urls/register", (req, res) => {
  let templateVars = { urls: urlDatabase, userid: req.cookies.get("userid") }
  res.render("urls_register", templateVars);
});



app.get("/urls/new", (req, res) => {
  let templateVars = { shortURL: req.params.id, userid: req.cookies.get("userid"),  urls: urlDatabase};
  res.render("urls_new", templateVars);
});

// respond to gets from /urls/new (serves form)

// resond to posts from /urls

app.get("/urls", (req, res) => {
  let templateVars = { urls: urlDatabase, userid: req.cookies.get("userid"), users: users }
  res.render("urls_index", templateVars);
});

app.post("/urls", (req, res) => {
  // console.log(req.body.longURL);  // debug statement to see POST parameters
  //res.send("Ok");         // Respond with 'Ok' (we will replace this)
  const tinyString =  String(randStr());
  urlDatabase[tinyString] = { longURL:req.body.longURL, userid: req.cookies.get("userid")};
  console.log(urlDatabase);
  res.redirect('urls/' + tinyString);

});

app.post("/urls/edit", (req, res) => {
  // console.log(req.body.longURL);  // debug statement to see POST parameters
  //res.send("Ok");         // Respond with 'Ok' (we will replace this)
  const tinyString = req.body.shortURL;
  const newURL = req.body.newURL;
  urlDatabase[tinyString].longURL = newURL ;
  console.log(urlDatabase);
  res.redirect('/urls/');

});

app.get("/url/:shortURL", (req, res) => {
  let templateVars = { urls: urlDatabase, userid: req.cookies.get("userid"), users: users };
  res.render("urls_view", templateVars);

});


app.get("/u/:shortURL", (req, res) => {
  //console.log(req.params.shortURL);
  let short = req.params.shortURL;
  let longURL = String(urlDatabase[short].longURL);
  if (longURL !== undefined) {
    res.redirect(301, longURL);
  } else {
    console.log("Incoming Request to unknown redirect " + short);
  }

});

app.post("/urls/login", (req, res) => {

  let userName = req.body.username;
  req.cookies.set("username", userName);
  res.redirect("/urls/");
  console.log(userName);

});

app.post("/urls/logout", (req, res) => {

  res.clearCookie("userid");
  res.redirect("/urls/");

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

app.get("/urls/:id", (req, res) => {
  let templateVars = { shortURL: req.params.id, userid: req.cookies.get("userid"), urls: urlDatabase};
  console.log(req.params.id);
  res.render("urls_view", templateVars);
});


// Tell the console the server is running

app.listen(PORT, () => {
  console.log(`Web Server listening on port ${PORT}!`);
});