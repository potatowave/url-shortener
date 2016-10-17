// Required Frameworks

const express = require("express");
const randStr = require("./randomstring");
const app = express();
const cookieSession = require('cookie-session')
const KeyGrip = require("keygrip")
const keys = new KeyGrip(['samsung note 7', 'iphone 7'], 'sha256')
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: true }));
const bcrypt = require('bcrypt');

// Configuration

var PORT = process.env.PORT || 8080; // default port 8080
app.set('view engine', 'ejs'); // Set View Engine to ejs

// Run time data

var urlDatabase = {
                    "3ffdn4": { longURL: "http://www.lighthouselabs.ca", userid: "w1e6xs" },
                    "dg4Vnf": { longURL: "http://www.github.com", userid: "3k3k33" },
                    "bhxj53": { longURL: "http://www.stackoverflow.com", userid: "css5cw" },
                    "9sd5xK": { longURL: "http://www.apple.com", userid: "w1e6xs" },
                    "0fkf0d": { longURL: "http://www.apple.com", userid: "w1e6xs" },
                    "33k30d": { longURL: "http://www.raspberrypi.org", userid: "w1e6xs" }
                  };

var users = { "w1e6xs": { id: "w1e6xs",  email: "test@account.com",
password: "$2a$10$0bBKVGRULgwtCj4ziMDBt.JBz0bkgReRU5Q42A1xlDR1Oek5VUBOS"} };

// Middleware

app.use(cookieSession({
  name: 'session',
  keys: ['key1', 'key2']
}));

app.use(express.static('public'));

// Routing

// respond to gets from /urls

app.post("/register", (req, res) => {
  const id =  String(randStr());
  let email = req.body.email;
  let plainPassword = req.body.password;
  const password = bcrypt.hashSync(plainPassword, 10);

  if (req.session.user_id === undefined) {

    if (!email) {
      res.sendStatus(400);
      return;
    } else if (!password) {
      res.sendStatus(400);
      return;

    } else {
      users[id] = { id: id, email: email, password: password };
      req.session.user_id = id;
      res.redirect('/');
    }

  } else {
    res.redirect('/');
  }

});

app.get("/", (req, res) => {

  res.redirect('urls/');

});

app.get("/register", (req, res) => {
  let templateVars = { urls: urlDatabase, userid: req.session.user_id };
  res.render("urls_register", templateVars);
});

app.get("/urls/new", (req, res) => {
  let templateVars = { shortURL: req.params.id, userid: req.session.user_id,  urls: urlDatabase, users : users};

  if (templateVars.userid !== undefined) {

    res.render("urls_new", templateVars);

  } else {

    res.send("You are not logged in.  Please <a href=\"/urls\">login</a> or <a href=\"/register\">register.</a>", 401);

  }

});

app.get("/urls", (req, res) => {

  let templateVars = { urls: urlDatabase, userid: req.session.user_id, users: users };

    res.render("urls_index", templateVars);

});

app.post("/urls", (req, res) => {
  const tinyString =  String(randStr());
  urlDatabase[tinyString] = { longURL:req.body.longURL, userid: req.session.user_id};
  res.redirect('urls/' + tinyString);

});

app.post("/urls/edit", (req, res) => {
  const tinyString = req.body.shortURL;
  const newURL = req.body.newURL;
  urlDatabase[tinyString].longURL = newURL ;
  res.redirect('/');
});

app.get("/urls/:shortURL", (req, res) => {

  let shortURL = req.params.shortURL;
  let templateVars = { urls: urlDatabase, userid: req.session.user_id, shortURL: shortURL, users:users };

  if (templateVars.userid !== templateVars.urls[shortURL].userid && templateVars.userid !== undefined) {

    res.send("Forbidden.  You cannot edit this.", 403);

  } else if (templateVars.userid === undefined) {

    res.send("You are not logged in.  Please <a href=\"/urls\">login</a> or <a href=\"/register\">register.</a>", 401);

  } else if (req.params.shortURL in templateVars.urls && templateVars.userid !== undefined) {

    res.render("urls_view", templateVars);

  }

});

app.get("/u/:shortURL", (req, res) => {

  let shortURL = req.params.shortURL;

  if (shortURL in urlDatabase) {

    let longURL = urlDatabase[shortURL].longURL;

    res.redirect(302, longURL); // change to 302, as browser was caching and pointing to old URL after editing.

  } else {

    res.send("404 not found. Re-direct does not exist or no URL to point to!", 404);

  }

});

app.post("/login", (req, res) => {

  let username = req.body.user;
  let password = req.body.password;


  let keys = Object.keys(users);

  keys.forEach((key) => {

    if (users[key].email === username) {

      if (bcrypt.compareSync(password, users[key].password)) {

        req.session.user_id = users[key].id;
        res.redirect("/");

      } else {

        res.send("Unsuccesful login!", 401);

      }

    }

  });

});

app.post("/logout", (req, res) => {

  req.session = null;
  res.redirect("/");

});

app.post("/urls/:id/delete", (req, res) => {

  if (req.session.user_id === users[req.session.user_id].id) {
    let id = req.params.id;
    delete urlDatabase[id];
    res.redirect(301, /urls/);

  } else {

    res.send("You do not have permission to delete that!");

  }

});

app.post("/urls/:id", (req, res) => {

  if (req.session.user_id === users[req.session.user_id].id) {

    let id = req.params.id;
    urlDatabase[id] = req.body.newURL;
    res.redirect(301, /urls/);

  } else {

    res.send("You do not have permission to edit that!");

  }

});

app.get("/urls/:id", (req, res) => {
  let templateVars = { shortURL: req.params.id, userid: req.session.user_id, urls: urlDatabase, users : users};
  res.render("urls_view", templateVars);
});


// Tell the console the server is running

app.listen(PORT, () => {
  console.log(`Web Server listening on port ${PORT}!`);
});