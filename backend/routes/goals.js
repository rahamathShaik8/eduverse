const express = require("express");
const router = express.Router();

const Goal = require("../models/Goal");

// GET Goals
router.get("/", async (req, res) => {
  try {
    const goals = await Goal.find().sort({ createdAt: -1 });
    res.json(goals);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST Goal
router.post("/", async (req, res) => {
  try {
    const { goal } = req.body;

    if (!goal) {
      return res.status(400).json({
        message: "Goal is required",
      });
    }

    const newGoal = new Goal({
      goal,
    });

    const savedGoal = await newGoal.save();

    res.status(201).json(savedGoal);
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
});

module.exports = router;
