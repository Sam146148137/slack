const { Router } = require('express');
const router = Router()

const { errorHandler } = require('../../middleware/errorHandler');
const { signupValidation, loginValidation } = require('../../validations/validations');
const authController = require('./auth.controller');
const authVerification = require('../../verifyication/auth.verification');

router.post('/signup', signupValidation, errorHandler, authController.signup);
router.post('/login', loginValidation, errorHandler, authController.login);
router.get('/verify/:id', authVerification.verify);


module.exports = router;