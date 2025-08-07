const User = require("../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const generateToken = (user) => {
  return jwt.sign({ id: user._id, email: user.email, role: user.role }, process.env.JWT_SECRET, {
    expiresIn: "1h",
  });
};

exports.register = async (req, res) => {
  const { email, password, role = "user", secretKey } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ msg: "User already exists" });

    // Admin role validation
    if (role === "admin" && secretKey !== process.env.ADMIN_SECRET) {
      return res.status(401).json({ msg: "Unauthorized admin registration" });
    }

    const hashed = await bcrypt.hash(password, 10);

    // Save role to DB
    const newUser = await User.create({ email, password: hashed, role });

    const token = generateToken(newUser);

    res.json({
      msg: "Registered successfully",
      token,
      user: { id: newUser._id, email: newUser.email, role: newUser.role },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: "Invalid credentials" });

    const token = generateToken(user);
    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,   // ✅ include name
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    console.error("Login error:", err); // ✅ Add this line to debug
    res.status(500).json({ error: err.message || "Internal server error" });
  }
};
