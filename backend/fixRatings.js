require('dotenv').config();
const mongoose = require("mongoose");
const Review = require("./models/Review");
const User = require("./models/User");

mongoose.connect(process.env.MONGO_URI).then(async () => {
  const users = await User.find({});
  
  for (const user of users) {
    const reviews = await Review.find({ reviewee: user._id });
    const average =
      reviews.length === 0
        ? 0
        : reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
        
    await User.findByIdAndUpdate(user._id, { rating: average });
    console.log(`Updated ${user.name} to rating ${average}`);
  }
  
  console.log("Finished updating ratings!");
  process.exit(0);
});
