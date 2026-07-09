const mongoose = require("mongoose");

const hubMessageSchema = new mongoose.Schema(
  {
    hub: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Hub",
      required: true,
    },
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    message: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("HubMessage", hubMessageSchema);
