const Swap = require("../models/Swap");
const User = require("../models/User");

// Send swap request
const sendSwapRequest = async (req, res) => {
  try {
    // Check if an active request already exists between these users
    const existingSwap = await Swap.findOne({
      $or: [
        { sender: req.user._id, receiver: req.body.receiver },
        { sender: req.body.receiver, receiver: req.user._id },
      ],
      status: { $in: ["pending", "accepted"] },
    });

    if (existingSwap) {
      return res.status(400).json({
        success: false,
        message:
          existingSwap.status === "accepted"
            ? "You are already swap friends with this user."
            : "A swap request is already pending between you and this user.",
      });
    }

    const user = await User.findById(req.user._id);
    if (!user || user.credits < 5) {
      return res.status(400).json({
        success: false,
        message: "Insufficient credits. You need 5 credits to send a request.",
      });
    }

    user.credits -= 5;
    await user.save();

    const swap = await Swap.create({
      sender: req.user._id,
      receiver: req.body.receiver,
      offeredSkill: req.body.offeredSkill,
      requestedSkill: req.body.requestedSkill,
      message: req.body.message,
    });

    res.status(201).json({
      success: true,
      message: "Swap request sent",
      swap,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Incoming requests
const getIncomingRequests = async (req, res) => {
  const requests = await Swap.find({
    receiver: req.user._id,
  })
    .populate("sender", "name email")
    .populate("receiver", "name email")
    .populate("offeredSkill requestedSkill");

  res.json({
    success: true,
    requests,
  });
};

// Outgoing requests
const getOutgoingRequests = async (req, res) => {
  const requests = await Swap.find({
    sender: req.user._id,
  })
    .populate("sender", "name email")
    .populate("receiver", "name email")
    .populate("offeredSkill requestedSkill");

  res.json({
    success: true,
    requests,
  });
};

// Update status
const updateSwapStatus = async (req, res) => {
  try {
    const swap = await Swap.findById(req.params.id);

    if (!swap) {
      return res.status(404).json({
        success: false,
        message: "Swap request not found",
      });
    }

    swap.status = req.body.status;

    await swap.save();

    res.json({
      success: true,
      message: "Swap request updated",
      swap,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Delete swap request
const deleteSwapRequest = async (req, res) => {
  try {
    const swap = await Swap.findById(req.params.id);

    if (!swap) {
      return res.status(404).json({
        success: false,
        message: "Swap request not found",
      });
    }

    // Ensure only the sender or receiver can delete it
    if (
      swap.sender.toString() !== req.user._id.toString() &&
      swap.receiver.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to delete this request",
      });
    }

    await Swap.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: "Swap request deleted",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  sendSwapRequest,
  getIncomingRequests,
  getOutgoingRequests,
  updateSwapStatus,
  deleteSwapRequest,
};