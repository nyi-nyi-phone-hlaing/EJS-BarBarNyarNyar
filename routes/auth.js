const express = require("express");
const router = express.Router();

const authController = require("../controllers/auth");

router.get("/login", authController.getLoginPage);

router.post("/login", authController.loginAccount);

router.get("/register", authController.getRegisterPage);

router.post("/register", authController.registerAccount);

router.post("/logout", authController.logout);

module.exports = router;
