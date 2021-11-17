const { Router } = require('express');
const router = Router()

const userController = require('./user.controller');
const verify = require('../../middleware/verifyToken');
const { createWorkspaceValidation } = require('../../validations/validations');
const { errorHandler } = require('../../middleware/errorHandler');

router.post('/addWorkspace', verify, createWorkspaceValidation, errorHandler, userController.createWorkspace);


module.exports = router;