const router = require('express').Router();
const { checkEmail, registerUser, loginUser } = require('../controllers/authController');

router.post('/check-email', checkEmail);
router.post('/register', registerUser);
router.post('/login', loginUser);

module.exports = router;
