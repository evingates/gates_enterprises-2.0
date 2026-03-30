const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');
const validate = require('../middleware/validateMiddleware');
const validators = require('../validators/userValidators');

router.use(authMiddleware);
router.use(roleMiddleware('seeker'));

router.get('/me', userController.getProfile);
router.put('/me', validate(validators.updateProfileSchema), userController.updateProfile);
router.patch('/me/password', validate(validators.changePasswordSchema), userController.updatePassword);

module.exports = router;
