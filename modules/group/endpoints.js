const { Router } = require('express');
const router = Router();

const groupController = require('./group.controller');
const verify = require('../../middleware/verifyToken');

router.post('/:id/addGroup', verify, groupController.createGroup);
router.post('/:workspaceId/:groupId', verify, groupController.joinUserToGroup);

module.exports = router;