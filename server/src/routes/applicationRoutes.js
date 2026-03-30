const express = require('express');
const router = express.Router();
const applicationController = require('../controllers/applicationController');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');
const validate = require('../middleware/validateMiddleware');
const validators = require('../validators/applicationValidators');

router.use(authMiddleware);

// Seeker routes
router.post('/', roleMiddleware('seeker'), validate(validators.applySchema), applicationController.applyToJob);
router.get('/my', roleMiddleware('seeker'), applicationController.getSeekerApplications);

// Employer routes
router.get('/job/:job_id', roleMiddleware('employer'), applicationController.getJobApplications);
router.patch('/:application_id/status', roleMiddleware('employer'), validate(validators.updateStatusSchema), applicationController.updateApplicationStatus);

module.exports = router;
