const Resource = require("../models/Resource");
const { awardXP } = require("../services/gamificationService");
const path = require("path");
const fs = require("fs");

const getResources = async (req, res) => {
  try {
    const { search, subject } = req.query;
    let query = { user: req.user._id };

    if (search) {
      query.title = { $regex: search, $options: "i" };
    }

    if (subject && subject !== "All" && subject !== "") {
      query.subject = subject;
    }

    const resources = await Resource.find(query).sort({ createdAt: -1 });
    res.json(resources);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch resources", error: error.message });
  }
};

const uploadResource = async (req, res) => {
  try {
    const { title, subject } = req.body;

    if (!title || !subject) {
      return res.status(400).json({ message: "Title and Subject are required" });
    }

    if (!req.file) {
      return res.status(400).json({ message: "PDF File is required" });
    }

    const newResource = await Resource.create({
      user: req.user._id,
      title,
      subject,
      fileName: req.file.originalname,
      filePath: req.file.filename, // We store unique suffix filename
      fileSize: req.file.size,
    });

    // Award 15 XP for uploading a resource
    await awardXP(req.user._id, 15, "Uploading a Resource");

    res.status(201).json(newResource);
  } catch (error) {
    res.status(500).json({ message: "Failed to upload resource", error: error.message });
  }
};

const downloadResource = async (req, res) => {
  try {
    const resource = await Resource.findById(req.params.id);

    if (!resource) {
      return res.status(404).json({ message: "Resource not found" });
    }

    // Verify ownership
    if (resource.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: "Not authorized to download this resource" });
    }

    const filePath = path.join(__dirname, "../uploads/resources", resource.filePath);

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ message: "Physical file not found on server" });
    }

    res.download(filePath, resource.fileName);
  } catch (error) {
    res.status(500).json({ message: "Failed to download resource", error: error.message });
  }
};

const deleteResource = async (req, res) => {
  try {
    const resource = await Resource.findById(req.params.id);

    if (!resource) {
      return res.status(404).json({ message: "Resource not found" });
    }

    // Verify ownership
    if (resource.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: "Not authorized to delete this resource" });
    }

    const filePath = path.join(__dirname, "../uploads/resources", resource.filePath);

    // Delete physical file from folder if exists
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    await resource.deleteOne();
    res.json({ message: "Resource deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete resource", error: error.message });
  }
};

module.exports = {
  getResources,
  uploadResource,
  downloadResource,
  deleteResource,
};
