const { body } = require("express-validator");
const User = require("../models/user");

exports.validateRegisterUsername = (username) => {
  return body(username)
    .exists()
    .withMessage("Username is required")
    .isLength({ min: 4, max: 20 })
    .withMessage("Username must be between 4 and 20 characters")
    .isAlphanumeric()
    .withMessage("Username can only contain letters and numbers");
};

exports.validateRegisterEmail = (email) => {
  return body(email)
    .exists()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Invalid email format")
    .custom((value, { req }) => {
      return User.findOne({ email: value }).then((user) => {
        if (user) {
          return Promise.reject("Email already exists");
        }
      });
    });
};

exports.validateRegisterPassword = (password) => {
  return body(password)
    .exists()
    .withMessage("Password is required")
    .not()
    .matches(/ /)
    .withMessage("Password cannot contain spaces")
    .isLength({ min: 6 })
    .trim()
    .withMessage("Password must be at least 6 characters long");
};

exports.validateLoginEmail = (email) => {
  return body(email)
    .exists()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Please enter a valid email");
};

exports.validateLoginPassword = (password) => {
  return body(password)
    .exists()
    .withMessage("Password is required")
    .not()
    .matches(/ /)
    .withMessage("Password cannot contain spaces")
    .isLength({ min: 6 })
    .trim()
    .withMessage("Password must be at least 6 characters long");
};

exports.validatePostTitle = (title) => {
  return body(title).exists().withMessage("Title is required");
};

exports.validatePostDescription = (description) => {
  return body(description).exists().withMessage("Description is required");
};

exports.validatePostPhoto = (photo) => {
  return body(photo)
    .exists()
    .withMessage("Photo is required")
    .isURL()
    .withMessage("Photo must be a valid URL")
    .isMimeType("image/jpeg", "image/png", "image/jpg")
    .withMessage("Photo must be a JPEG, PNG or JPG");
};

exports.validateResetPassword = (password) => {
  return body(password)
    .exists()
    .withMessage("Password is required")
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
