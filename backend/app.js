const express = require("express");
const cors = require("cors");

const app = express();

// Middlewares 
app.use(cors());
app.use(express.json());  
 
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const swapRoutes = require("./routes/swapRoutes");
const skillRoutes = require("./routes/skillRoutes");
const chatRoutes = require("./routes/chatRoutes");
const sessionRoutes = require("./routes/sessionRoutes");
const reviewRoutes = require("./routes/reviewRoutes");
const paymentRoutes = require("./routes/paymentRoutes");

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/swaps", swapRoutes);
app.use("/api/skills", skillRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/sessions", sessionRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/payments", paymentRoutes);

// Test Route
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Skill Swap API Running 🚀",
  });
});

module.exports = app;