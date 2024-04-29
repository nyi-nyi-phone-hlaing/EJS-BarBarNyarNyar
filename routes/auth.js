const express = require("express");
const router = express.Router();

const authController = require("../controllers/auth");

//? GET -> /login
router.get("/login", authController.getLoginPage);

//? POST -> /login
router.post("/login", authController.loginAccount);

//? GET -> /register
router.get("/register", authController.getRegisterPage);

//? POST -> /register
router.post("/register", authController.registerAccount);

//? POST -> /logout
router.post("/logout", authController.logout);

module.exports = router;
