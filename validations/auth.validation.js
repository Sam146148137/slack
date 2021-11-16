const { body } = require('express-validator');

exports.signupValidation = [
    body('email').isEmail().withMessage({ message: 'invalid email'}),
    body('name').isLength({min: 3}).withMessage({message: 'The name must be 3+ characters long'}),
    body('password').isLength({min: 5}).withMessage({message: 'The password must be 5+ characters long'})
]

exports.loginValidation = [
    body('email').isEmail().withMessage({ message: 'invalid email'}),
    body('password').isLength({min: 5}).withMessage({message: 'The password must be 5+ characters long'})
]