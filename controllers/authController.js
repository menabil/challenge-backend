const User = require("../models/User");

const checkEmail = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    res.json({ exists: !!user });
  } catch (e) {
    res.status(500).json({ message: "Server error" });
  }
};

const registerUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (await User.findOne({ email })) {
      return res.status(400).json({ message: "Email already exists" });
    }

    const user = await User.create({ email, password });
    res
      .status(201)
      .json({ _id: user._id, email: user.email, password: user.password });
  } catch (e) {
    res.status(500).json({ message: "Server error" });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user || !user.matchPassword(password)) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    res.json({ _id: user._id, email: user.email, password: user.password });
  } catch (e) {
    res.status(500).json({ message: "Server error" });
  }
};

const logoutUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user || !user.matchPassword(password)) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    res.json({ _id: user._id, email: user.email, password: user.password });
  } catch (e) {
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { checkEmail, registerUser, loginUser, logoutUser };
