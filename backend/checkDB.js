const mongoose = require("mongoose");
const Review = require("./models/Review");
const User = require("./models/User");
const Swap = require("./models/Swap");

require('dotenv').config();
mongoose.connect(process.env.MONGO_URI).then(async () => {
  const reviews = await Review.find({}).lean();
  console.log("=== ALL REVIEWS ===");
  console.log(reviews);

  const boobathis = await User.find({ name: /Boobathi/i }).lean();
  console.log("\n=== USERS NAMED BOOBATHI ===");
  console.log(boobathis.map(u => ({ id: u._id, email: u.email, skills: u.skillsOffered })));

  const swaps = await Swap.find({}).lean();
  console.log("\n=== ALL SWAPS ===");
  console.log(swaps);

  process.exit(0);
});
