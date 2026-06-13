const express = require("express");

const router = express.Router();

let resources = [];

router.get("/", (req, res) => {
  res.json(resources);
});

router.post("/", (req, res) => {
  const { title, subject } = req.body;

  if (!title || !subject || title.trim() === "" || subject.trim() === "") {
    return res.status(400).json({
      message: "Title and subject are required",
    });
  }

  const newResource = {
    id: Date.now(),
    title,
    subject,
    createdAt: new Date(),
  };
  resources.push(newResource);

  res.status(201).json(newResource);
});

module.exports = router;
