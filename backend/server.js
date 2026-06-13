const express = require("express");
const cors = require("cors");

const notesRoutes = require("./routes/notes");
const goalsRoutes = require("./routes/goals");
const resourcesRoutes = require("./routes/resources");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/notes", notesRoutes);
app.use("/api/goals", goalsRoutes);
app.use("/api/resources", resourcesRoutes);

app.get("/", (req, res) => {
  res.json({
    message: "Welcome to EduVerse API",
  });
});

const PORT = 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
