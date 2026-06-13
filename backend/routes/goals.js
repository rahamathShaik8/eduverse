const express = require("express");

const router = express.Router();

let goals = [];

router.get("/", (req, res) => {
  res.json(goals);
});

router.post("/", (req, res) => {
  const { goal } = req.body;

  if (!goal || goal.trim() === "") {
    return res.status(400).json({
      message: "Goal is required",
    });
  }

  const newGoal = {
    id: Date.now(),
    goal,
    createdAt: new Date(),
  };

  goals.push(newGoal);

  res.status(201).json(newGoal);
});

module.exports = router;
