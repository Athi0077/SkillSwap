const Message = require("../../models/Message");

module.exports = (io) => {
  io.on("connection", (socket) => {

    // ── Chat ──────────────────────────────────────────────
    socket.on("join", (userId) => {
      socket.join(userId);
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

      io.to(data.receiver).emit("receiveMessage", message);
      io.to(data.sender).emit("receiveMessage", message);
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
      console.log("User Disconnected");
    });

  });
};