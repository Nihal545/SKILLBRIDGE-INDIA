const User = require('../models/User');
const Job = require('../models/Job');
const Transaction = require('../models/Transaction');

// @desc    Get dashboard stats
// @route   GET /api/admin/stats
exports.getStats = async (req, res) => {
    try {
        const totalUsers = await User.countDocuments();
        const activeJobs = await Job.countDocuments({ status: 'open' });
        const revenue = await Transaction.aggregate([
            { $match: { status: 'completed' } },
            { $group: { _id: null, total: { $sum: '$amount' } } }
        ]);
        const pendingVerifications = await User.countDocuments({ 'idVerification.status': 'pending' });

        res.json({
            totalUsers,
            activeJobs,
            revenue: revenue[0] ? revenue[0].total : 0,
            pendingVerifications
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Manage user status
// @route   PUT /api/admin/users/:id/verify
exports.verifyUser = async (req, res) => {
    try {
        const { status } = req.body; // 'approved' or 'rejected'
        const user = await User.findById(req.params.id);
        
        if (!user) return res.status(404).json({ message: 'User not found' });

        user.idVerification.status = status;
        if (status === 'approved') {
            user.verified = true;
        } else {
            user.verified = false;
        }

        await user.save();
        res.json({ message: `User verification ${status}` });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get all users with pending verification
// @route   GET /api/admin/pending-verifications
exports.getPendingVerifications = async (req, res) => {
    try {
        const users = await User.find({ 'idVerification.status': 'pending' })
            .select('name email idVerification');
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get recent transactions
// @route   GET /api/admin/transactions
exports.getRecentTransactions = async (req, res) => {
    try {
        const transactions = await Transaction.find()
            .sort({ createdAt: -1 })
            .limit(10)
            .populate('user', 'name');
        res.json(transactions);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
