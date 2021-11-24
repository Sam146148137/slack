const { Router } = require('express');
const router = Router()

const userController = require('./user.controller');
const verify = require('../../middleware/verifyToken');
const { createWorkspaceValidation } = require('../../validations/validations');
const { errorHandler } = require('../../middleware/errorHandler');
const verification = require('../../verifyication/inviteVerification');

router.post('/addWorkspace', verify, createWorkspaceValidation, errorHandler, userController.createWorkspace);
router.post('/userInvite/:id', verify, userController.inviteUser);
router.get('/invite/:id', verification.verify);

module.exports = router;