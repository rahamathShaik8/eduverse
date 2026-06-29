const mongoose = require("mongoose");

const focusSessionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    type: {
      type: String,
      enum: ["Pomodoro", "Stopwatch"],
      required: true,
    },
    duration: {
      type: Number, // duration in seconds
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("FocusSession", focusSessionSchema);
