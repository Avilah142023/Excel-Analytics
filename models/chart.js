const mongoose = require('mongoose');

const chartSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', 
    required: true,
  },
  chartType: {
    type: String,
    required: true,
  },
  format: {
    type: String,
    enum: ['png', 'pdf'],
    required: true,
  },
  fileName: {
    type: String,
    required: true,
  }
}, { timestamps: true }); // ✅ createdAt and updatedAt fields

module.exports = mongoose.model('Chart', chartSchema);
