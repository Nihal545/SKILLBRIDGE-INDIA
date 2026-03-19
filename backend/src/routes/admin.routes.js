const express = require('express');
const router = express.Router();
const { 
    getStats, 
    verifyUser, 
    getPendingVerifications, 
    getRecentTransactions,
    getUsers,
    banUser,
    getJobs,
    deleteJob 
} = require('../controllers/admin.controller');
const { protect, authorize } = require('../middlewares/auth.middleware');

router.use(protect);
router.use(authorize('admin'));

router.get('/stats', getStats);
router.get('/pending-verifications', getPendingVerifications);
router.get('/transactions', getRecentTransactions);
router.put('/users/:id/verify', verifyUser);

// New Moderation Routes
router.get('/users', getUsers);
router.put('/users/:id/ban', banUser);
router.get('/jobs', getJobs);
router.delete('/jobs/:id', deleteJob);

module.exports = router;
