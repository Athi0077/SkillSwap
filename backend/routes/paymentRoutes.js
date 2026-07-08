const express = require("express");
const protect = require("../middleware/authMiddleware");
const { createOrder, verifyPayment } = require("../controllers/paymentController");

const router = express.Router();

router.post("/create-order", protect, createOrder);
router.post("/verify-payment", protect, verifyPayment);

module.exports = router;
