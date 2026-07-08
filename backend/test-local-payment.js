const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const User = require("./models/User");
require("dotenv").config();

async function testPayment() {
  await mongoose.connect(process.env.MONGO_URI);
  
  // Get any user
  const user = await User.findOne({});
  if (!user) {
    console.log("No user found");
    process.exit(1);
  }

  // Generate token
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "30d" });

  // Make request to local server
  const responseLocal = await fetch("http://localhost:5000/api/payments/create-order", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    },
    body: JSON.stringify({ amount: 500, credits: 50 })
  });

  const dataLocal = await responseLocal.json();
  console.log("Local Server Response:", dataLocal);

  // Make request to live server
  const responseLive = await fetch("https://skillswap-cuf7.onrender.com/api/payments/create-order", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    },
    body: JSON.stringify({ amount: 500, credits: 50 })
  });

  const dataLive = await responseLive.json();
  console.log("Live Server Response:", dataLive);

  process.exit(0);
}

testPayment().catch(err => {
  console.error(err);
  process.exit(1);
});
