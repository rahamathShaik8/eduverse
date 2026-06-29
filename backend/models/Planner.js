const mongoose = require("mongoose");

const plannerSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    type: {
      type: String,
      enum: ["Task", "Schedule", "Exam"],
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    date: {
      type: Date,
      required: true,
    },
    time: {
      type: String, // format "HH:MM"
      trim: true,
    },
    isCompleted: {
      type: Boolean,
      default: false,
    },
    examSubject: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Planner", plannerSchema);
