const Message = require("../../models/Message");
const HubMessage = require("../../models/HubMessage");
const Hub = require("../../models/Hub");

const onlineUsers = new Set();
const socketUserMap = {};

module.exports = (io) => {
  io.on("connection", (socket) => {

    // ── Chat ──────────────────────────────────────────────
    socket.on("join", (userId) => {
      socket.join(userId);
      socketUserMap[socket.id] = userId;
      onlineUsers.add(userId);
      io.emit("onlineUsers", Array.from(onlineUsers));
    });

    socket.on("sendMessage", async (data) => {
      const Swap = require("../../models/Swap");
      const activeSwap = await Swap.findOne({
        $or: [
          { sender: data.sender, receiver: data.receiver },
          { sender: data.receiver, receiver: data.sender },
        ],
        status: "accepted",
      });

      if (!activeSwap) {
        // Emit error back to sender
        io.to(data.sender).emit("messageError", "You can only chat with users you have an active skill swap with.");
        return;
      }

      const message = await Message.create({
        sender: data.sender,
        receiver: data.receiver,
        message: data.message,
      });

      const msgData = message.toJSON();

      io.to(data.receiver).emit("receiveMessage", msgData);
      io.to(data.sender).emit("receiveMessage", msgData);
    });

    socket.on("markMessagesAsRead", async ({ senderId, receiverId }) => {
      // senderId is the person who sent the messages.
      // receiverId is the person who just opened the chat and read them.
      await Message.updateMany(
        { sender: senderId, receiver: receiverId, read: false },
        { $set: { read: true } }
      );
      // Notify the sender that their messages were read
      io.to(senderId).emit("messagesRead", { receiverId });
    });

    socket.on("typing", ({ senderId, receiverId }) => {
      io.to(receiverId).emit("userTyping", { senderId });
    });

    socket.on("stopTyping", ({ senderId, receiverId }) => {
      io.to(receiverId).emit("userStoppedTyping", { senderId });
    });

    // ── Hub Chat ──────────────────────────────────────────
    socket.on("join-hub-room", (hubId) => {
      socket.join(`hub_${hubId}`);
    });

    socket.on("leave-hub-room", (hubId) => {
      socket.leave(`hub_${hubId}`);
    });

    socket.on("send-hub-message", async (data) => {
      try {
        const { hubId, sender, message } = data;

        // Ensure user is in the hub
        const hub = await Hub.findById(hubId);
        if (!hub || !hub.members.some(memberId => memberId.toString() === sender.toString())) {
          io.to(socket.id).emit("messageError", "You are not a member of this hub.");
          return;
        }

        const newHubMessage = await HubMessage.create({
          hub: hubId,
          sender: sender,
          message: message,
        });

        const populatedMessage = await newHubMessage.populate("sender", "name username profileImage");

        io.to(`hub_${hubId}`).emit("receive-hub-message", populatedMessage);
      } catch (error) {
        console.error("Hub Chat Error:", error);
      }
    });

    // ── Video Call Signaling (WebRTC) ─────────────────────
    // Both peers join a room identified by sessionId
    socket.on("join-room", ({ sessionId, userId }) => {
      socket.join(sessionId);
      // Notify the other peer already in the room
      socket.to(sessionId).emit("peer-joined", { userId });
    });

    // Relay WebRTC offer from caller to callee
    socket.on("offer", ({ sessionId, offer }) => {
      socket.to(sessionId).emit("offer", { offer });
    });

    // Relay WebRTC answer from callee to caller
    socket.on("answer", ({ sessionId, answer }) => {
      socket.to(sessionId).emit("answer", { answer });
    });

    // Relay ICE candidates between peers
    socket.on("ice-candidate", ({ sessionId, candidate }) => {
      socket.to(sessionId).emit("ice-candidate", { candidate });
    });

    // Notify when a peer leaves the call
    socket.on("leave-room", ({ sessionId }) => {
      socket.to(sessionId).emit("peer-left");
      socket.leave(sessionId);
    });

    socket.on("disconnect", () => {
      const userId = socketUserMap[socket.id];
      if (userId) {
        onlineUsers.delete(userId);
        delete socketUserMap[socket.id];
        io.emit("onlineUsers", Array.from(onlineUsers));
      }
    });

  });
};