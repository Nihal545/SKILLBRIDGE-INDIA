const express = require('express');
const router = express.Router();
const { submitProposal, getJobProposals, getFreelancerProposals } = require('../controllers/proposal.controller');
const { protect, authorize } = require('../middlewares/auth.middleware');

router.post('/', protect, authorize('freelancer'), submitProposal);
router.get('/job/:jobId', protect, authorize('client', 'admin'), getJobProposals);
router.get('/freelancer', protect, authorize('freelancer'), getFreelancerProposals);

module.exports = router;
