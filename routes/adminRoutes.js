const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const User = require("../models/User");
const File = require("../models/file");
const Chart = require("../models/chart");

// Middleware to check if user is admin
const isAdmin = async (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    next();
  } else {
    res.status(403).json({ message: "Admin access only" });
  }
};

// GET all users
router.get("/users", protect, isAdmin, async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: "Error fetching users" });
  }
});

// ✅ GET all uploads and downloads in unified format
router.get("/usage", protect, isAdmin, async (req, res) => {
  try {
    // Correct the populate field name
    const uploads = await File.find().populate("uploadedBy", "email").lean();
    const downloads = await Chart.find().populate("userId", "email").lean();

    const uploadHistory = uploads.map((file) => ({
      userEmail: file.uploadedBy?.email || "Unknown",
      type: "upload",
      chartType: "Excel File",
      format: "xlsx",
      createdAt: file.uploadDate,
    }));

    const downloadHistory = downloads.map((chart) => ({
      userEmail: chart.userId?.email || "Unknown",
      type: "download",
      chartType: chart.chartType,
      format: chart.format,
      createdAt: chart.createdAt,
    }));

    const usage = [...uploadHistory, ...downloadHistory].sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    );

    res.json(usage);
  } catch (err) {
    console.error("Usage history error:", err);
    res.status(500).json({ message: "Error fetching usage data" });
  }
});

module.exports = router;
