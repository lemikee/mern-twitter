const validText = (str) => {
  return typeof str === "string" && str.trim().length > 0; //first check that it is string, and then checks that its not just a bunch of empty spaces
};

module.exports = validText;
