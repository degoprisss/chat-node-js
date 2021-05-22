const express = require("express");
const router = express.Router();

const verifyToken = require("../helpers/verifyToken.js");

const chatController = require("../controllers/chatController");

router.get("/rooms", verifyToken, chatController.getRooms);
router.post("/rooms", verifyToken, chatController.addRoom);
router.post("/rooms/:id/addMembers", verifyToken, chatController.addMembers);
router.post("/rooms/:id/sendMessage", verifyToken, chatController.sendMessage);
router.get("/rooms/:id/messages", verifyToken, chatController.getMessages);
router.delete("/rooms/:id", verifyToken, chatController.deleteRoom);
router.delete("/rooms/:id/members", verifyToken, chatController.deleteMembers);

module.exports = router;