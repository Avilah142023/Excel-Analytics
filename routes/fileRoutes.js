const express = require("express");
const multer = require("multer");
const xlsx = require("xlsx");

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });
const { protect } = require("../middleware/authMiddleware");
const File = require("../models/File"); // ✅ Ensure File model is imported

// Upload Excel file
router.post("/upload", upload.single("file"), (req, res) => {
  try {
    const workbook = xlsx.read(req.file.buffer, { type: "buffer" });
    const sheetName = workbook.SheetNames[0];
    const data = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName], { defval: "" });

    res.json({ columns: Object.keys(data[0] || {}), data });
  } catch (err) {
    console.error("Upload Error:", err);
    res.status(500).json({ error: "Failed to parse Excel file" });
  }
});

// Get upload history
router.get("/history", protect, async (req, res) => {
  try {
    const files = await File.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.json(files);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
