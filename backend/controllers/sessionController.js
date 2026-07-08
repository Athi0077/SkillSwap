const Session = require("../models/Session");

// Create Session (from chat — host = logged-in user)
const createSession = async (req, res) => {
  try {
    const session = await Session.create({
      host: req.user._id,
      guest: req.body.guest,
      scheduledAt: req.body.scheduledAt,
      duration: req.body.duration || 60,
      topic: req.body.topic || "",
    });

    // Populate for response
    const populated = await Session.findById(session._id)
      .populate("host", "name profileImage")
      .populate("guest", "name profileImage");

    res.status(201).json({
      success: true,
      session: populated,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get My Sessions
const getMySessions = async (req, res) => {
  try {
    const sessions = await Session.find({
      $or: [
        { host: req.user._id },
        { guest: req.user._id },
      ],
    })
      .populate("host", "name profileImage")
      .populate("guest", "name profileImage")
      .sort({ scheduledAt: 1 });

    res.json({
      success: true,
      schedules: sessions,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Update Status (accept / complete / cancel)
const updateSessionStatus = async (req, res) => {
  try {
    const session = await Session.findById(req.params.id);

    if (!session) {
      return res.status(404).json({
        success: false,
        message: "Session not found",
      });
    }

    session.status = req.body.status;
    await session.save();

    const populated = await Session.findById(session._id)
      .populate("host", "name profileImage")
      .populate("guest", "name profileImage");

    res.json({
      success: true,
      session: populated,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  createSession,
  getMySessions,
  updateSessionStatus,
};