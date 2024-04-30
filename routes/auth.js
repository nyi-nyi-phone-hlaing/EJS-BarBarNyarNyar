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

//? GET -> /reset-password
router.get("/reset-password", authController.getResetPage);

//? POST -> /reset
router.post("/reset", authController.resetLinkSend);

//? GET -> /feedback
router.get("/feedback", authController.getFeedbackPage);

//? GET -> /reset-password/{token}
router.get("/reset-password/:token", authController.getResetForm);

//? POST -> /change-new-password
router.post("/change-new-password", authController.changeNewPassword);

module.exports = router;
