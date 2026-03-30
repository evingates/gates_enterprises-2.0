const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const validate = require('../middleware/validateMiddleware');
const validators = require('../validators/authValidators');

router.post('/seeker/register', validate(validators.registerSeekerSchema), authController.registerSeeker);
router.post('/seeker/login', validate(validators.loginSchema), authController.loginSeeker);
router.post('/employer/register', validate(validators.registerEmployerSchema), authController.registerEmployer);
router.post('/employer/login', validate(validators.loginSchema), authController.loginEmployer);

module.exports = router;
