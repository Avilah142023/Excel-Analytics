const File = require("../models/file");

// Upload a new file
const uploadFile = async (req, res) => {
  try {
    const { originalname, mimetype, path, size } = req.file;
    const uploadedBy = req.user._id;

    const newFile = new File({
      filename: originalname,
      path,
      mimetype,
      size,
      uploadedBy,
      uploadDate: new Date(),
    });

    await newFile.save();

    res.status(201).json({
      message: "File uploaded successfully",
      file: newFile,
    });
  } catch (error) {
    console.error("Upload error:", error);
    res.status(500).json({ error: "File upload failed" });
  }
};

// Get all files uploaded by the current user
const getUserFiles = async (req, res) => {
  try {
    const files = await File.find({ uploadedBy: req.user._id }).sort({ uploadDate: -1 });
    res.status(200).json(files);
  } catch (err) {
    console.error("History error:", err);
    res.status(500).json({ error: "Could not fetch upload history" });
  }
};

module.exports = {
  uploadFile,
  getUserFiles,
};
