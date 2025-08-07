const Chart = require('../models/chart');

// Save a downloaded chart
const saveChartDownload = async (req, res) => {
  try {
    const { chartType, format, fileName } = req.body;

    const chart = new Chart({
      userId: req.user._id,
      chartType,
      format,
      fileName,
    });

    await chart.save();
    res.status(201).json({ message: 'Chart download saved successfully' });
  } catch (error) {
    console.error('Error saving chart:', error);
    res.status(500).json({ error: 'Failed to save chart download' });
  }
};

// Get all charts of a user
const getUserCharts = async (req, res) => {
  try {
    const charts = await Chart.find({ userId: req.user._id }).sort({ createdAt: -1 });
    res.json(charts);
  } catch (error) {
    console.error('Error fetching charts:', error);
    res.status(500).json({ error: 'Failed to fetch downloaded charts' });
  }
};

// Get user downloads (same as above but separated for semantic clarity)
const getUserDownloads = async (req, res) => {
  try {
    const downloads = await Chart.find({ userId: req.user._id }).sort({ createdAt: -1 });
    res.json(downloads);
  } catch (error) {
    console.error('Failed to fetch user downloads:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  saveChartDownload,
  getUserCharts,
  getUserDownloads,
};
