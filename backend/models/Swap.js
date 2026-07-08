const mongoose = require("mongoose");

const swapSchema = new mongoose.Schema(
  {
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    receiver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    offeredSkill: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Skill",
    },

    requestedSkill: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Skill",
    },

    message: {
      type: String,
      default: "",
    },

    status: {
      type: String,
      enum: ["pending", "accepted", "rejected", "cancelled", "completed"],
      default: "pending",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Swap", swapSchema);