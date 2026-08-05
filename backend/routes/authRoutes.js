const express = require("express");
const router = express.Router();
const { checkEmail, register, login } = require("../controllers/authController");

// User শুধু email পাঠাবে -> account আছে কি না চেক হবে
router.post("/check-email", checkEmail);

// নতুন ইউজার হলে email + password দিয়ে account তৈরি
router.post("/register", register);

// পুরাতন ইউজার হলে email + password দিয়ে login
router.post("/login", login);

module.exports = router;
