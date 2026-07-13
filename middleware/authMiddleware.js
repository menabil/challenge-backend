const User = require("../models/User");

const protect = async (req, res, next) => {
  const email = req.headers["x-user-email"];
  const password = req.headers["x-user-password"];

  if (!email || !password) {
    return res.status(401).json({ message: "Auth headers required" });
  }

  const user = await User.findOne({ email });
  if (!user || user.password !== password) {
    return res.status(401).json({ message: "Invalid auth" });
  }

  req.user = user;
  next();
};

module.exports = { protect };
