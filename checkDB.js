const mongoose = require("mongoose");
const Review = require("./backend/models/Review");
const User = require("./backend/models/User");

mongoose.connect("mongodb://127.0.0.1:27017/skillswap").then(async () => {
  const reviews = await Review.find({});
  console.log("ALL REVIEWS IN DB:");
  console.log(JSON.stringify(reviews, null, 2));

  const boobathi = await User.findOne({ name: "Boobathi" });
  if (boobathi) {
    console.log("BOOBATHI ID:", boobathi._id);
    const boobathiReviews = await Review.find({ reviewee: boobathi._id });
    console.log("REVIEWS FOR BOOBATHI:", boobathiReviews);
  } else {
    console.log("BOOBATHI NOT FOUND");
  }

  process.exit(0);
});
