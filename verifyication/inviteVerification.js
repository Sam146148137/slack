const jwt = require("jsonwebtoken");

const userController = require('../modules/user/user.controller');

exports.verify = async (req, res, next) =>{
    // Check we have an id
    const { id } = req.params;

    if(!id) {
        console.log('Missing Token');
        return res.status(422).json({message: 'Missing Token'});
    }

    // Verify the token from the URL
    try {
            jwt.verify(id, process.env.USER_VERIFICATION_TOKEN_SECRET);
    } catch (e) {
        next(e);
    }

    try {
        //importing user, currentWorkspace and emailRecipientId from user.controller
        const user = await userController.emailRecipient.user;
        const currentWorkspace = await userController.emailRecipient.workspace;
        const emailRecipient = await userController.emailRecipient.id;

        // pushing and saving new members in workspace
        currentWorkspace.idMembers.push(emailRecipient);

        // pushing current workspaceId in invited user workspaceId field
        user.workSpaceId.push(currentWorkspace);

        currentWorkspace.save();

        user.save();

        console.log('You confirmed our invite to join our workspace');
        return res.status(200).json({message: 'You confirmed our invite to join our workspace'});
    } catch (e) {
        next(e);
    }
};
