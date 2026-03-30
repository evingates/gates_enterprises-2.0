const express = require('express');
const router = express.Router();
const jobController = require('../controllers/jobController');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');
const validate = require('../middleware/validateMiddleware');
const validators = require('../validators/jobValidators');

// Protected routes (Employers)
router.post('/', authMiddleware, roleMiddleware('employer'), validate(validators.createJobSchema), jobController.createJob);
router.get('/my', authMiddleware, roleMiddleware('employer'), jobController.getMyJobs);
router.put('/:job_id', authMiddleware, roleMiddleware('employer'), validate(validators.updateJobSchema), jobController.updateJob);
router.patch('/:job_id/toggle', authMiddleware, roleMiddleware('employer'), jobController.toggleJobActive);

// Protected routes (Seekers)
router.get('/matched', authMiddleware, roleMiddleware('seeker'), jobController.getMatchedJobs);

// Public routes (Keep generic ones at the bottom)
router.get('/', jobController.getAllJobs);
router.get('/:job_id', jobController.getJobById);

module.exports = router;
