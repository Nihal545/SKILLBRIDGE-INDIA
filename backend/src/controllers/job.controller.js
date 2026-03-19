const Job = require('../models/Job');
const calculateBidsRequired = require('../utils/calculateBids');

// @desc    Create a new job
// @route   POST /api/jobs
exports.createJob = async (req, res) => {
    try {
        const { title, description, budget, skills, urgent } = req.body;
        
        const bidsRequired = calculateBidsRequired({
            budget,
            urgent,
            skills,
            premiumClient: req.user.premiumClient || false
        });

        const job = await Job.create({
            title,
            description,
            budget,
            skills,
            urgent,
            clientId: req.user._id,
            bidsRequired
        });

        res.status(201).json(job);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get all jobs
// @route   GET /api/jobs
exports.getJobs = async (req, res) => {
    try {
        const jobs = await Job.find({ status: 'open' }).populate('clientId', 'name rating');
        res.json(jobs);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get job by ID
// @route   GET /api/jobs/:id
exports.getJobById = async (req, res) => {
    try {
        const job = await Job.findById(req.params.id).populate('clientId', 'name rating');
        if (!job) return res.status(404).json({ message: 'Job not found' });
        res.json(job);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get all jobs created by the logged-in client
// @route   GET /api/jobs/client
exports.getClientJobs = async (req, res) => {
    try {
        const jobs = await Job.find({ clientId: req.user._id }).sort({ createdAt: -1 });
        res.json(jobs);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Close a job
// @route   PUT /api/jobs/:id/close
exports.closeJob = async (req, res) => {
    try {
        const job = await Job.findOne({ _id: req.params.id, clientId: req.user._id });
        if (!job) return res.status(404).json({ message: 'Job not found or unauthorized' });
        
        job.status = 'closed';
        await job.save();
        res.json({ message: 'Job successfully closed' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
