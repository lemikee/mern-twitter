// we organize out routes for users here instead of putting them all in app.js, which could result in hundreds of lines

const express = require("express");
const router = express.Router();
const User = require("../../models/User");
const bcrypt = require("bcryptjs");
const keys = require("../../config/keys");
const jwt = require("jsonwebtoken");
const validateRegisterInput = require("../../validation/register");
const validateLoginInput = require("../../validation/login");

router.get("/test", (req, res) => {
  // this is one route
  res.json({ msg: "This is the user route" });
});

router.post("/register", (req, res) => {
  // note that this is a POST request, "router.post"

  const { errors, isValid } = validateRegisterInput(req.body);

  if (!isValid) {
    // from line 20, recall, validation return errors, and isValid which is a boolean
    return res.status(400).json(errors);
  }

  User.findOne({ email: req.body.email }) // use User model, check if user already exists
    .then((user) => {
      if (user) {
        // return level 400 error is the user already exists
        return res
          .status(400)
          .json({ email: "A user is already registered with that email." });
      } else {
        // otherwise create the user and save it
        const newUser = new User({
          handle: req.body.handle,
          email: req.body.email,
          password: req.body.password,
        });

        // newUser
        //   .save()
        //   .then((user) => res.send(user))
        //   .catch((err) => res.send(err));

        bcrypt.genSalt(10, (err, salt) => {
          // first arg is number of rounds we do to generate the salt, second arg is salt we get back
          bcrypt.hash(newUser.password, salt, (err, hash) => {
            // we salt the user's password
            if (err) throw err;
            newUser.password = hash; // set user's password to the hash
            newUser
              .save()
              .then((user) => res.json(user))
              .catch((err) => res.console.log(err));
          });
        });
      }
    });
});

router.post("/login", (req, res) => {
  const email = req.body.email; // extract email and password
  const password = req.body.password;

  const { errors, isValid } = validateLoginInput(req.body);

  if (!isValid) {
    return res.status(400).json(errors);
  }

  User.findOne({ email }) // findOne returns a single object, find returns an array
    .then((user) => {
      if (!user) {
        // if user doesn't exist, give status of 404 and json saying user DNE
        return res.status(404).json({ email: "This user does not exist." });
      }

      // beyond the if statement, we do have a user, so let's check if pwd is the same
      bcrypt.compare(password, user.password).then((isMatch) => {
        if (isMatch) {
          const payload = {
            // payload we send back upon successful login
            id: user.id, // id will be from mongodb
            handle: user.handle,
            email: user.email,
          };
          jwt.sign(
            payload,
            keys.secretOrKey,
            { expiresIn: 3600 },
            (err, token) => {
              res.json({
                success: true,
                token: "Bearer " + token,
              });
            }
          );
        } else {
          return res.status(400).json({ password: "Incorrect password." });
        }
      });
    });
});

module.exports = router;
