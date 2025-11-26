const validator = require("validator");
const validateSignupData = (req) => {
  const { firstName, lastName, email, password } = req.body;
  if (!firstName || !lastName) {
    throw new Error("in valid names");
  } else if (!validator.isEmail) {
    throw new Error("in valid email id");
  } else if (!validator.isStrongPassword) {
    throw new Error("enter strong password");
  }
};

module.exports = { validateSignupData };
