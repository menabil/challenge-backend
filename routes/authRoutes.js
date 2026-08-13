const router = require("express").Router();
const {
  checkEmail,
  registerUser,
  loginUser,
  logoutUser,
} = require("../controllers/authController");

router.post("/check-email", checkEmail);
router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/logout", logoutUser);

module.exports = router;
