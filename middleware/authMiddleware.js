// middleware/authMiddleware.js
const jwt = require("jsonwebtoken"); 
const User = require("../models/User");

const protect = async (req, res, next) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");

  if (!token) {
    return res.status(401).json({ error: "Access denied. No token provided." });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select("-password");
    next();
  } catch (err) {
    res.status(400).json({ error: "Invalid token." });
  }
};

module.exports = { protect };
