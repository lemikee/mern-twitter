// setup server w/ express and node

const express = require("express"); // need to require express
const app = express(); // create the app object, using express
const mongoose = require("mongoose");
const db = require("./config/keys").mongoURI; // returns object in config/keys, so need to key into it w/ mongo.URI
const users = require("./routes/api/users");
const tweets = require("./routes/api/tweets");
const User = require("./models/User");
const bodyParser = require("body-parser"); // tells our app what sorts of requests it should respond to

mongoose
  .connect(db, { useNewUrlParser: true })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.log(err));

app.use(
  bodyParser.urlencoded({ // app will respond to requests from other software like postman
    extended: false,
  })
);

app.use(bodyParser.json()); // app will respond to json

app.get("/", (req, res) => {
  const user = new User({
    // we create a use and save it
    handle: "jim",
    email: "jim@jim.com",
    password: "password",
  });
  user.save();
  // we will be listening for get requests on the route route "/" (first arg), if we do get such a request, we will respond with the second arg, req and res are request and response objects
  res.send("Hello World!");
});

app.use("/api/users", users); // app.use, if we get a request that starts with api/users, we will pass in users (above) //, ie route is /api/users/test, where test is defined in users.js
app.use("/api/tweets", tweets);

// we want to tell app object that we want it to listen an a given port
const port = process.env.PORT || 5000; // use port given or use 5000

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});

// now when we run node app.js in terminal and navigate to localhost:5000, we see hello world!
