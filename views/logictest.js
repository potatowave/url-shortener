var users = { "3k3k33": { id: "3k3k33",  email: "kinetic@icloud.com", password: "$2a$10$sF0JfAgzxxODwUmjmNI4jeRzNLFxvCzOE4zWudc.EZEb2if1xWiNC"},
              "8fndjd": { id: "8fndjd",  email: "steve@jobs.com", password: "$2a$10$sF0JfAgzxxODwUmjmNI4jeRzNLFxvCzOE4zWudc.EZEb2if1xWiNC"},
              "0f8ddf": { id: "0f8ddf",  email: "bill@microsoft.com", password: "$2a$10$sF0JfAgzxxODwUmjmNI4jeRzNLFxvCzOE4zWudc.EZEb2if1xWiNC"} };



let keys = Object.keys(users);

keys.forEach((key) => {

  //console.log(users[key].email);

    if (users[key].email === "steve@jobs.com") {
      console.log("You do exist.");
      console.log(users[key].email)
      return;
    }

});
