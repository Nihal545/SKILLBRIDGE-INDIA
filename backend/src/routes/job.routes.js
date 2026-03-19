const express = require('express');
const router = express.Router();
const { createJob, getJobs, getJobById, getClientJobs, closeJob } = require('../controllers/job.controller');
const { protect, authorize } = require('../middlewares/auth.middleware');

router.get('/', getJobs);
router.get('/client', protect, authorize('client'), getClientJobs);
router.get('/:id', getJobById);
router.post('/', protect, authorize('client', 'admin'), createJob);
router.put('/:id/close', protect, authorize('client'), closeJob);

module.exports = router;
