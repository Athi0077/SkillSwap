// controllers/chatController.js

const Message = require("../models/Message");

const getMessages = async (req, res) => {
  try {
    const { userId } = req.params;

    const messages = await Message.find({
      $or: [
        { sender: req.user._id, receiver: userId },
        { sender: userId, receiver: req.user._id },
      ],
    }).sort({ createdAt: 1 });

    res.json({ success: true, messages });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const sendMessage = async (req, res) => {
  try {
    const { userId } = req.params;
    const { message } = req.body;

    const Swap = require("../models/Swap");
    const activeSwap = await Swap.findOne({
      $or: [
        { sender: req.user._id, receiver: userId },
        { sender: userId, receiver: req.user._id },
      ],
      status: "accepted",
    });

    if (!activeSwap) {
      return res.status(403).json({
        success: false,
        message: "You can only chat with users you have an active skill swap with.",
      });
    }

    const newMessage = await Message.create({
      sender: req.user._id,
      receiver: userId,
      message,
    });

    res.status(201).json({ success: true, message: newMessage });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getConversations = async (req, res) => {
  try {
    const messages = await Message.find({
      $or: [{ sender: req.user._id }, { receiver: req.user._id }]
    }).sort({ createdAt: -1 }).populate("sender", "name profileImage").populate("receiver", "name profileImage");

    const conversationsMap = new Map();

    messages.forEach(msg => {
      const otherUser = msg.sender._id.toString() === req.user._id.toString() ? msg.receiver : msg.sender;
      const otherUserId = otherUser._id.toString();

      if (!conversationsMap.has(otherUserId)) {
        conversationsMap.set(otherUserId, {
          _id: otherUserId,
          participants: [req.user, otherUser],
          lastMessage: msg.message,
          updatedAt: msg.createdAt
        });
      }
    });

    const chats = Array.from(conversationsMap.values());
    res.json({ success: true, chats });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getMessages,
  sendMessage,
  getConversations
};