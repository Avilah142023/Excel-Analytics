// server.js

const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const dotenv = require("dotenv");

const authRoutes = require("./routes/authRoutes");
const fileRoutes = require("./routes/fileRoutes");
const chartRoutes = require('./routes/chartRoutes');
const adminRoutes = require("./routes/adminRoutes");



dotenv.config();

const app = express();

// CORS setup: allows frontend from port 5173
app.use(cors({
  origin: "http://localhost:5173",
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use(express.json());
app.use('/api/charts', chartRoutes);


// Routes
app.use("/api/auth", authRoutes);
app.use("/api/files", fileRoutes);
app.use("/api/admin", adminRoutes);

// MongoDB connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.error("MongoDB error:", err));


// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
