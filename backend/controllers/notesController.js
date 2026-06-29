const Note = require("../models/Note");
const { awardXP } = require("../services/gamificationService");

const getNotes = async (req, res) => {
  try {
    const { search, category } = req.query;
    let query = { user: req.user._id };

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { content: { $regex: search, $options: "i" } },
      ];
    }

    if (category && category !== "All") {
      query.category = category;
    }

    // Sort by pinned first, then by creation date descending
    const notes = await Note.find(query).sort({ isPinned: -1, createdAt: -1 });
    res.json(notes);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch notes", error: error.message });
  }
};

const createNote = async (req, res) => {
  try {
    const { title, content, category } = req.body;

    if (!title || !content) {
      return res.status(400).json({ message: "Title and content are required" });
    }

    const note = await Note.create({
      user: req.user._id,
      title,
      content,
      category: category || "General",
    });

    // Award 10 XP for creating a note
    await awardXP(req.user._id, 10, "Creating a Note");

    res.status(201).json(note);
  } catch (error) {
    res.status(500).json({ message: "Failed to create note", error: error.message });
  }
};

const updateNote = async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);

    if (!note) {
      return res.status(404).json({ message: "Note not found" });
    }

    // Verify ownership
    if (note.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: "Not authorized to update this note" });
    }

    note.title = req.body.title || note.title;
    note.content = req.body.content || note.content;
    note.category = req.body.category || note.category;

    const updatedNote = await note.save();
    res.json(updatedNote);
  } catch (error) {
    res.status(500).json({ message: "Failed to update note", error: error.message });
  }
};

const deleteNote = async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);

    if (!note) {
      return res.status(404).json({ message: "Note not found" });
    }

    // Verify ownership
    if (note.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: "Not authorized to delete this note" });
    }

    await note.deleteOne();
    res.json({ message: "Note deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete note", error: error.message });
  }
};

const togglePin = async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);

    if (!note) {
      return res.status(404).json({ message: "Note not found" });
    }

    if (note.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: "Not authorized" });
    }

    note.isPinned = !note.isPinned;
    await note.save();
    res.json(note);
  } catch (error) {
    res.status(500).json({ message: "Failed to toggle pin", error: error.message });
  }
};

const toggleFavourite = async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);

    if (!note) {
      return res.status(404).json({ message: "Note not found" });
    }

    if (note.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: "Not authorized" });
    }

    note.isFavourite = !note.isFavourite;
    await note.save();
    res.json(note);
  } catch (error) {
    res.status(500).json({ message: "Failed to toggle favourite", error: error.message });
  }
};

module.exports = {
  getNotes,
  createNote,
  updateNote,
  deleteNote,
  togglePin,
  toggleFavourite,
};
