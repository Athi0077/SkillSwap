const mongoose = require("mongoose");

const sessionSchema = new mongoose.Schema(
  {
    swap: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Swap",
      required: false,   // optional — sessions can be created from chat
    },

    topic: {
      type: String,
      default: "",
    },

    host: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    guest: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    scheduledAt: {
      type: Date,
      required: true,
    },

    duration: {
      type: Number,
      default: 60,
    },

    meetingLink: {
      type: String,
      default: "",
    },

    status: {
      type: String,
      enum: [
        "pending",
        "accepted",
        "completed",
        "cancelled"
      ],
      default: "pending",
    }
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Session", sessionSchema);