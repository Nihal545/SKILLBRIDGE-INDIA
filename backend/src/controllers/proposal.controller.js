const Proposal = require('../models/Proposal');
const Job = require('../models/Job');
const User = require('../models/User');

// @desc    Submit a proposal
// @route   POST /api/proposals
exports.submitProposal = async (req, res) => {
    try {
        const { jobId, coverLetter, bidAmount } = req.body;
        const freelancerId = req.user._id;

        // Check if freelancer is verified
        if (!req.user.verified) {
            return res.status(403).json({ message: 'Identity verification required to bid' });
        }

        const job = await Job.findById(jobId);
        if (!job) return res.status(404).json({ message: 'Job not found' });

        // Check if already applied
        const existingProposal = await Proposal.findOne({ jobId, freelancerId });
        if (existingProposal) {
            return res.status(400).json({ message: 'Already submitted a proposal for this job' });
        }

        // Check bids
        if (req.user.bids < job.bidsRequired) {
            return res.status(400).json({ message: 'Insufficient bids' });
        }

        // Deduct bids
        await User.findByIdAndUpdate(freelancerId, { $inc: { bids: -job.bidsRequired } });

        const proposal = await Proposal.create({
            jobId,
            freelancerId,
            coverLetter,
            bidAmount
        });

        res.status(201).json(proposal);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get proposals for a job (Client only)
// @route   GET /api/proposals/job/:jobId
exports.getJobProposals = async (req, res) => {
    try {
        const proposals = await Proposal.find({ jobId: req.params.jobId })
            .populate('freelancerId', 'name email rating verified');
        res.json(proposals);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get all proposals submitted by the logged-in freelancer
// @route   GET /api/proposals/freelancer
exports.getFreelancerProposals = async (req, res) => {
    try {
        const proposals = await Proposal.find({ freelancerId: req.user._id })
            .populate('jobId', 'title budget status')
            .sort({ createdAt: -1 });
        res.json(proposals);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Hire a freelancer (accept proposal) - Client only
// @route   PUT /api/proposals/:proposalId/hire
exports.hireFreelancer = async (req, res) => {
    try {
        const proposal = await Proposal.findById(req.params.proposalId).populate('jobId');
        if (!proposal) return res.status(404).json({ message: 'Proposal not found' });

        // Ensure the client owns the job
        if (String(proposal.jobId.clientId) !== String(req.user._id)) {
            return res.status(403).json({ message: 'Not authorized' });
        }

        // Mark proposal as accepted/hired
        proposal.status = 'hired';
        await proposal.save();

        // Close the job
        await Job.findByIdAndUpdate(proposal.jobId._id, { status: 'closed' });

        // Reject all other proposals for this job
        await Proposal.updateMany(
            { jobId: proposal.jobId._id, _id: { $ne: proposal._id } },
            { status: 'rejected' }
        );

        res.json({ message: 'Freelancer hired successfully!', proposal });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

