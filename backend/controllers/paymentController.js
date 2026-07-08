const Razorpay = require("razorpay");
const crypto = require("crypto");
const User = require("../models/User");

// Initialize Razorpay with test keys to bypass Render env issues temporarily
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || "rzp_test_TAwmU8DgG4NUPu",
  key_secret: process.env.RAZORPAY_KEY_SECRET || "kHAs25eLCzYQSqn1MEAXFMNv",
});

// Create Order
const createOrder = async (req, res) => {
  try {
    const { amount, credits } = req.body;

    if (!amount || !credits) {
      return res.status(400).json({ success: false, message: "Amount and credits are required" });
    }

    const options = {
      amount: amount * 100, // Razorpay works in paise
      currency: "INR",
      receipt: `receipt_${req.user._id}_${Date.now()}`,
    };

    const order = await razorpay.orders.create(options);

    res.json({
      success: true,
      order,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message || "Razorpay Error", errorDetails: error });
  }
};

// Verify Payment
const verifyPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, credits } = req.body;

    const secret = process.env.RAZORPAY_KEY_SECRET || "kHAs25eLCzYQSqn1MEAXFMNv";
    const body = razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSignature = crypto
      .createHmac("sha256", secret)
      .update(body.toString())
      .digest("hex");

    const isAuthentic = expectedSignature === razorpay_signature;

    if (isAuthentic) {
      // Add credits to user
      const user = await User.findById(req.user._id);
      if (user) {
        user.credits += Number(credits);
        await user.save();
      }

      res.json({
        success: true,
        message: "Payment verified successfully",
        user,
      });
    } else {
      res.status(400).json({
        success: false,
        message: "Invalid signature",
      });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  createOrder,
  verifyPayment,
};
