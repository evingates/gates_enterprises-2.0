const express = require('express');
const router = express.Router();
const companyController = require('../controllers/companyController');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');
const validate = require('../middleware/validateMiddleware');
const validators = require('../validators/companyValidators');

// Protected/Specific routes first
router.get('/me', authMiddleware, roleMiddleware('employer'), companyController.getCompany);
router.put('/me', authMiddleware, roleMiddleware('employer'), validate(validators.updateCompanySchema), companyController.updateCompany);

// Param routes last
router.get('/:company_id', companyController.getPublicCompany);

module.exports = router;
