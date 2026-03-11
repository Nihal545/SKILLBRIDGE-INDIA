const express = require('express');
const router = express.Router();
const { getStats, verifyUser, getPendingVerifications, getRecentTransactions } = require('../controllers/admin.controller');
const { protect, authorize } = require('../middlewares/auth.middleware');

router.use(protect);
router.use(authorize('admin'));

router.get('/stats', getStats);
router.get('/pending-verifications', getPendingVerifications);
router.get('/transactions', getRecentTransactions);
router.put('/users/:id/verify', verifyUser);

module.exports = router;
