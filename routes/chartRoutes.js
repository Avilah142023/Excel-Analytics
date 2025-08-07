const express = require('express');
const router = express.Router();
const {
  saveChartDownload,
  getUserCharts,
  getUserDownloads,
} = require('../controllers/chartController');
const { protect } = require("../middleware/authMiddleware"); // ✅ Use correct middleware

// Route to save a chart after download
router.post('/save', protect, saveChartDownload);

// Route to get user's charts (used in dashboard or history)
router.get('/my-charts', protect, getUserCharts);

// Route to get all downloads by the logged-in user
router.get('/user-downloads', protect, getUserDownloads);

module.exports = router;
