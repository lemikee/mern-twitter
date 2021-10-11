const Validator = require("validator");
const validText = require("./valid-text");

module.exports = function (data) {
  let errors = {};

  // first check that email and password exists, if nonexistant, set to empty string
  data.email = validText(data.email) ? data.email : "";
  data.password = validText(data.password) ? data.password : "";

  if (!Validator.isEmail(data.email)) {
    errors.email = "Email is invalid."; //now we begin to populate our errors object on line 5
  }

  if (Validator.isEmpty(data.email)) {
    errors.email = "Email field is required."; // checks if email field is empty
  }

  if (Validator.isEmpty(data.password)) {
    errors.password = "Password field is required."; // checks if password field is empty
  }

  return {
    errors,
    isValid: Object.keys(errors).length == 0, // if there are zero errors, isValid is true
  };
};
