const { body, check } = require("express-validator");
const User = require("../models/user");

exports.validateRegisterUsername = (username) => {
  return body(username)
    .isLength({ min: 4, max: 20 })
    .withMessage("Username must be between 4 and 20 characters")
    .isAlphanumeric()
    .withMessage("Username can only contain letters and numbers");
};

exports.validateRegisterEmail = (email) => {
  return body(email)
    .isEmail()
    .withMessage("Invalid email format")
    .custom((value, { req }) => {
      return User.findOne({ email: value }).then((user) => {
        if (user) {
          return Promise.reject("Email is already exists");
        }
      });
    });
};

exports.validateRegisterPassword = (password) => {
  return body(password)
    .not()
    .matches(/ /)
    .withMessage("Password cannot contain spaces")
    .isLength({ min: 6 })
    .trim()
    .withMessage("Password must be at least 6 characters long");
};

exports.validateLoginEmail = (email) => {
  return body(email).isEmail().withMessage("Please enter a valid email");
};

exports.validateLoginPassword = (password) => {
  return body(password)
    .not()
    .matches(/ /)
    .withMessage("Password cannot contain spaces")
    .isLength({ min: 6 })
    .trim()
    .withMessage("Password must be at least 6 characters long");
};

exports.validatePostTitle = (title) => {
  return check(title, "Title is required")
    .trim()
    .notEmpty()
    .withMessage("Title cannot be empty")
    .isLength({ min: 10, max: 200 })
    .withMessage("Title must be between 10 and 200 characters");
};

exports.validatePostDescription = (description) => {
  return body(description)
    .trim()
    .notEmpty()
    .withMessage("Description cannot be empty")
    .isLength({ min: 50 })
    .withMessage("Description must be at least 50 characters long");
};

exports.validatePostPhoto = (photo) => {
  return check(photo, "Photo is required")
    .notEmpty()
    .withMessage("Photo URL cannot be empty")
    .isURL()
    .withMessage("Photo must be a valid URL");
};

exports.validateResetEmail = (email) => {
  return body(email).isEmail().withMessage("Invalid email format");
};

exports.validateResetPassword = (password) => {
  return body(password)
    .not()
    .matches(/ /)
    .withMessage("Password cannot contain spaces")
    .isLength({ min: 6 })
    .trim()
    .withMessage("Password must be at least 6 characters long");
};

exports.validateResetConfirmPassword = (confirmPassword) => {
  return body(confirmPassword)
    .trim()
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error("Passwords do not match");
      }
      return true;
    });
};
