const express = require("express");
const protect = require("../middleware/authMiddleware");

const {
  addSkill,
  getMySkills,
  deleteSkill,
  getAllSkills,
  searchSkills,
} = require("../controllers/skillController");

const router = express.Router();

router.get("/all", getAllSkills);
router.get("/search", searchSkills);
router.post("/", protect, addSkill);
router.get("/", protect, getMySkills);
router.delete("/:id", protect, deleteSkill);

module.exports = router;