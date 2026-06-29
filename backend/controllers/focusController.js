const FocusSession = require("../models/FocusSession");
const { awardXP } = require("../services/gamificationService");

const getSessions = async (req, res) => {
  try {
    const sessions = await FocusSession.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(sessions);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch focus sessions", error: error.message });
  }
};

const addSession = async (req, res) => {
  try {
    const { type, duration } = req.body;

    if (!type || !duration) {
      return res.status(400).json({ message: "Session type and duration are required" });
    }

    const session = await FocusSession.create({
      user: req.user._id,
      type,
      duration, // in seconds
    });

    // Award 5 XP for a focus session
    await awardXP(req.user._id, 5, "Completing a Focus Session");

    res.status(201).json(session);
  } catch (error) {
    res.status(500).json({ message: "Failed to save focus session", error: error.message });
  }
};

const getStats = async (req, res) => {
  try {
    const userId = req.user._id;

    // Fetch all user focus sessions
    const sessions = await FocusSession.find({ user: userId });

    const totalSeconds = sessions.reduce((acc, curr) => acc + curr.duration, 0);
    const totalMinutes = Math.floor(totalSeconds / 60);
    const totalHours = (totalSeconds / 3600).toFixed(1);

    // Calculate weekly study hours breakdown (last 7 days)
    const statsByDay = {};
    const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    
    // Seed last 7 days with 0 hours
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dayLabel = daysOfWeek[d.getDay()];
      statsByDay[dayLabel] = 0;
    }

    sessions.forEach((s) => {
      const date = new Date(s.createdAt);
      // Check if session is within the last 7 days
      const diffTime = Math.abs(new Date() - date);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      if (diffDays <= 7) {
        const dayLabel = daysOfWeek[date.getDay()];
        if (statsByDay[dayLabel] !== undefined) {
          statsByDay[dayLabel] += parseFloat((s.duration / 3600).toFixed(2));
        }
      }
    });

    res.json({
      totalHours: parseFloat(totalHours),
      totalMinutes,
      sessionsCompleted: sessions.length,
      weeklyBreakdown: Object.keys(statsByDay).map((day) => ({
        day,
        hours: parseFloat(statsByDay[day].toFixed(2)),
      })),
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to compile focus statistics", error: error.message });
  }
};

module.exports = {
  getSessions,
  addSession,
  getStats,
};
