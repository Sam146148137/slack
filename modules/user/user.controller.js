const Workspace = require("../../models/workspace.model");
const User = require('../../models/auth.model');

exports.createWorkspace = async (req, res, next) => {

    try {

        console.log(req.user, 'located in function createWorkSpace', 88888888888888888888888888888888888888888888888)
        
        // Creating and saving the workspace
        const workspace = await new Workspace({
            idMembers: req.user.id,
            workspaceName: req.body.workspaceName,
        })
        const _id = workspace.idMembers

        // adding new workspaces id`s in user workspaceId
        const user = await User.findById({_id});
        let addingIds = user.workSpaceId.push(workspace._id)

        // inserting workspaceId to user workspaceId`s and updating user
        await User.findByIdAndUpdate({_id},
            {
                ...req.body,
                workSpaceId: user.workSpaceId,
            },
        );

        workspace.save();
        
        console.log(`${req.body.workspaceName} Workspace is created`, 88888888888888888888888888888888888888888888888);
        return res.status(200).json({message: `${req.body.workspaceName} Workspace is created`});

    } catch (e) {
        next(e);
    }
};