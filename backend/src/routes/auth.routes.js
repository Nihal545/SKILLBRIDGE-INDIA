const express = require('express');
const router = express.Router();
const { registerUser, loginUser, getUserProfile, submitVerification } = require('../controllers/auth.controller');
const { protect } = require('../middlewares/auth.middleware');

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/profile', protect, getUserProfile);
router.post('/verify', protect, submitVerification);

module.exports = router;
