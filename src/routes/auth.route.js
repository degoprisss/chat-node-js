const express = require("express");
const router = express.Router();

const authController = require("../controllers/authController");
const chatController = require("../controllers/chatController");

const verifyToken = require("../helpers/verifyToken.js");

router.post("/signup", authController.signUp);
router.post("/signin", authController.signIn);
router.get("/user", verifyToken, authController.getAuthenticatedUser);

module.exports = router;
