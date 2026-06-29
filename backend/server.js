const express = require("express");
const cors = require("cors");

const connectDB = require("./config/db");

const notesRoutes = require("./routes/notes");
const goalsRoutes = require("./routes/goals");
const resourcesRoutes = require("./routes/resources");

const app = express();

// Connect MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/notes", notesRoutes);
app.use("/api/goals", goalsRoutes);
app.use("/api/resources", resourcesRoutes);

// Home Route
app.get("/", (req, res) => {
  res.json({
    message: "Welcome to EduVerse API",
  });
});

// Start Server
const PORT = 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
