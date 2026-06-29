const Goal = require("../models/Goal");
const { awardXP } = require("../services/gamificationService");

const getGoals = async (req, res) => {
  try {
    const goals = await Goal.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(goals);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch goals", error: error.message });
  }
};

const createGoal = async (req, res) => {
  try {
    const { goal, priority, deadline } = req.body;

    if (!goal) {
      return res.status(400).json({ message: "Goal text is required" });
    }

    const newGoal = await Goal.create({
      user: req.user._id,
      goal,
      priority: priority || "Medium",
      deadline: deadline || null,
    });

    res.status(201).json(newGoal);
  } catch (error) {
    res.status(500).json({ message: "Failed to create goal", error: error.message });
  }
};

const updateGoal = async (req, res) => {
  try {
    const goalItem = await Goal.findById(req.params.id);

    if (!goalItem) {
      return res.status(404).json({ message: "Goal not found" });
    }

    if (goalItem.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: "Not authorized to update this goal" });
    }

    goalItem.goal = req.body.goal || goalItem.goal;
    goalItem.priority = req.body.priority || goalItem.priority;
    goalItem.deadline = req.body.deadline || goalItem.deadline;

    const updatedGoal = await goalItem.save();
    res.json(updatedGoal);
  } catch (error) {
    res.status(500).json({ message: "Failed to update goal", error: error.message });
  }
};

const deleteGoal = async (req, res) => {
  try {
    const goalItem = await Goal.findById(req.params.id);

    if (!goalItem) {
      return res.status(404).json({ message: "Goal not found" });
    }

    if (goalItem.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: "Not authorized to delete this goal" });
    }

    await goalItem.deleteOne();
    res.json({ message: "Goal deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete goal", error: error.message });
  }
};

const toggleComplete = async (req, res) => {
  try {
    const goalItem = await Goal.findById(req.params.id);

    if (!goalItem) {
      return res.status(404).json({ message: "Goal not found" });
    }

    if (goalItem.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: "Not authorized" });
    }

    goalItem.isCompleted = !goalItem.isCompleted;
    await goalItem.save();

    // Award 20 XP if the goal was marked completed
    if (goalItem.isCompleted) {
      await awardXP(req.user._id, 20, "Completing a Goal");
    }

    res.json(goalItem);
  } catch (error) {
    res.status(500).json({ message: "Failed to toggle completion status", error: error.message });
  }
};

module.exports = {
  getGoals,
  createGoal,
  updateGoal,
  deleteGoal,
  toggleComplete,
};
