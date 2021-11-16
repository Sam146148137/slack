const { Router } = require('express');
const router = Router()

const { errorHandler } = require('../middleware/errorHandler');
const { signupValidation, loginValidation } = require('../validations/auth.validation');
const authController = require('./auth.controller');

router.post('/signup', signupValidation, errorHandler, authController.signup);
router.post('/login', loginValidation, errorHandler, authController.login);
router.get('/verify/:id', authController.verify);


module.exports = router;