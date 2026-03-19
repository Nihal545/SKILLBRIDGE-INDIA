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
            .populate('userId', 'name');
        res.json(transactions);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get all users
// @route   GET /api/admin/users
exports.getUsers = async (req, res) => {
    try {
        const users = await User.find({ role: { $ne: 'admin' } }).select('-password');
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Ban or Unban a user
// @route   PUT /api/admin/users/:id/ban
exports.banUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ message: 'User not found' });
        
        // Toggle verified status or add a new 'isBanned' schema field. 
        // For now, let's use the 'verified' flag to ban them if we don't want to change the schema.
        // Or simply delete them. The user asked for "ban". A quick way without schema change is setting role to 'banned'.
        user.role = user.role === 'banned' ? 'freelancer' : 'banned';
        await user.save();
        
        res.json({ message: `User status updated to ${user.role}` });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get all jobs
// @route   GET /api/admin/jobs
exports.getJobs = async (req, res) => {
    try {
        const jobs = await Job.find().populate('clientId', 'name').sort({ createdAt: -1 });
        res.json(jobs);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Delete a job
// @route   DELETE /api/admin/jobs/:id
exports.deleteJob = async (req, res) => {
    try {
        const job = await Job.findByIdAndDelete(req.params.id);
        if (!job) return res.status(404).json({ message: 'Job not found' });
        res.json({ message: 'Job successfully removed' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
