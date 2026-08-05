const User = require("../models/User");

// @desc    ইউজার শুধু email পাঠাবে, backend চেক করবে account আছে কি না
// @route   POST /api/auth/check-email
const checkEmail = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const existingUser = await User.findOne({ email: email.toLowerCase() });

    if (existingUser) {
      // পুরাতন ইউজার -> password চাওয়া হবে
      return res.status(200).json({
        isNewUser: false,
        message: "Account already exists. Please enter your password to login.",
      });
    } else {
      // নতুন ইউজার -> নতুন password সেট করতে বলা হবে
      return res.status(200).json({
        isNewUser: true,
        message: "No account found with this email. Please set a new password to create an account.",
      });
    }
  } catch (error) {
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    নতুন ইউজার হলে email + password দিয়ে account তৈরি হবে
// @route   POST /api/auth/register
const register = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const existingUser = await User.findOne({ email: email.toLowerCase() });

    if (existingUser) {
      return res.status(400).json({ message: "Account already exists with this email. Please login instead." });
    }

    // Note: JWT/bcrypt ব্যবহার হচ্ছে না, তাই password সরাসরি সেভ হচ্ছে
    const newUser = await User.create({ email: email.toLowerCase(), password });

    return res.status(201).json({
      message: "Account created successfully",
      user: { id: newUser._id, email: newUser.email },
    });
  } catch (error) {
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    পুরাতন ইউজার হলে email + password মিলিয়ে login হবে
// @route   POST /api/auth/login
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const user = await User.findOne({ email: email.toLowerCase() });

    if (!user) {
      return res.status(404).json({ message: "No account found with this email" });
    }

    // Note: JWT/bcrypt ছাড়া সরাসরি password মিলিয়ে দেখা হচ্ছে
    if (user.password !== password) {
      return res.status(401).json({ message: "Incorrect password. Please try again." });
    }

    return res.status(200).json({
      message: "Login successful",
      user: { id: user._id, email: user.email },
    });
  } catch (error) {
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = { checkEmail, register, login };
