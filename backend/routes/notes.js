const express = require("express");

const router = express.Router();

let notes = [];

router.get("/", (req, res) => {
  res.json(notes);
});

router.post("/", (req, res) => {
  const { title, content } = req.body;

  if (!title || !content || title.trim() === "" || content.trim() === "") {
    return res.status(400).json({
      message: "Title and content are required",
    });
  }

  const newNote = {
    id: Date.now(),
    title,
    content,
    createdAt: new Date(),
  };
  notes.push(newNote);

  res.status(201).json(newNote);
});

module.exports = router;
