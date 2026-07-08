const express = require("express");
const protect = require("../middleware/authMiddleware");
const { getMessages, getConversations, sendMessage } = require("../controllers/chatController");

const router = express.Router();

router.get("/conversations", protect, getConversations);
router.get("/:userId", protect, getMessages);
router.post("/:userId", protect, sendMessage);

module.exports = router;
