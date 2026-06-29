const Planner = require("../models/Planner");
const { awardXP } = require("../services/gamificationService");

const getPlannerItems = async (req, res) => {
  try {
    const items = await Planner.find({ user: req.user._id }).sort({ date: 1, time: 1 });
    res.json(items);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch planner items", error: error.message });
  }
};

const createPlannerItem = async (req, res) => {
  try {
    const { type, title, date, time, examSubject } = req.body;

    if (!type || !title || !date) {
      return res.status(400).json({ message: "Type, Title, and Date are required" });
    }

    const item = await Planner.create({
      user: req.user._id,
      type,
      title,
      date,
      time: time || null,
      examSubject: type === "Exam" ? examSubject : null,
    });

    res.status(201).json(item);
  } catch (error) {
    res.status(500).json({ message: "Failed to create planner item", error: error.message });
  }
};

const updatePlannerItem = async (req, res) => {
  try {
    const item = await Planner.findById(req.params.id);

    if (!item) {
      return res.status(404).json({ message: "Planner item not found" });
    }

    if (item.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: "Not authorized" });
    }

    item.title = req.body.title || item.title;
    item.date = req.body.date || item.date;
    item.time = req.body.time !== undefined ? req.body.time : item.time;
    item.isCompleted = req.body.isCompleted !== undefined ? req.body.isCompleted : item.isCompleted;
    item.examSubject = req.body.examSubject !== undefined ? req.body.examSubject : item.examSubject;

    const updatedItem = await item.save();
    res.json(updatedItem);
  } catch (error) {
    res.status(500).json({ message: "Failed to update planner item", error: error.message });
  }
};

const deletePlannerItem = async (req, res) => {
  try {
    const item = await Planner.findById(req.params.id);

    if (!item) {
      return res.status(404).json({ message: "Planner item not found" });
    }

    if (item.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: "Not authorized" });
    }

    await item.deleteOne();
    res.json({ message: "Planner item deleted" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete planner item", error: error.message });
  }
};

const toggleComplete = async (req, res) => {
  try {
    const item = await Planner.findById(req.params.id);

    if (!item) {
      return res.status(404).json({ message: "Planner item not found" });
    }

    if (item.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: "Not authorized" });
    }

    item.isCompleted = !item.isCompleted;
    await item.save();

    // Award 5 XP on task completion
    if (item.isCompleted && item.type === "Task") {
      await awardXP(req.user._id, 5, "Completing a Planner Task");
    }

    res.json(item);
  } catch (error) {
    res.status(500).json({ message: "Failed to toggle completion", error: error.message });
  }
};

module.exports = {
  getPlannerItems,
  createPlannerItem,
  updatePlannerItem,
  deletePlannerItem,
  toggleComplete,
};
