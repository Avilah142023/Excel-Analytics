const mongoose = require("mongoose");

const fileSchema = new mongoose.Schema({
  filename: {
    type: String,
    required: true
  },
  uploadedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  uploadDate: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("File", fileSchema);
