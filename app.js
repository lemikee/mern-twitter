// setup server w/ express and node

const express = require("express"); // need to require express
const app = express(); // create the app object, using express

app.get("/", (req, res) => {
  // we will be listening for get requests on the route route "/" (first arg), if we do get such a request, we will respond with the second arg, req and res are request and response objects
  res.send("Hello World!");
});

// we want to tell app object that we want it to listen an a given port

const port = process.env.PORT || 5000; // use port given or use 5000

app.listen(port, () => {
  console.log(`Listening on port ${port}`)
})

// now when we run node app.js in terminal and navigate to localhost:5000, we see hello world!