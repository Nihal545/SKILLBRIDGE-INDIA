const express = require('express');
const router = express.Router();
const { createJob, getJobs, getJobById } = require('../controllers/job.controller');
const { protect, authorize } = require('../middlewares/auth.middleware');

router.get('/', getJobs);
router.get('/:id', getJobById);
router.post('/', protect, authorize('client', 'admin'), createJob);

module.exports = router;
