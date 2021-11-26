const Group = require('../../models/group.model');
const User = require('../../models/user.model');
const Workspace = require("../../models/workspace.model");

exports.createGroup = async (req, res, next) => {
    //importing variables from req.body
    const userId = req.user.id;
    const workspaceId = req.params.id;
    const { name } = req.body;

    try {
        // checking if we have a group with this name in the database
        const nameExist = await Group.findOne({ name });
        if(nameExist){
            console.log(`there is already a group with the ${ name } name`);
            return res.status(409).json({message: `there is already a group with the ${ name } name`});
        }

        // saving Group
        const group = new Group({
            name: name,
            workspaceId: workspaceId,
            private: req.body.private,
            userId: userId
        });

        group.save();

        console.log(`group ${ name } is created`);
        return res.status(201).json({message: `group ${ name } is created`});
    } catch (e) {
        next(e);
    }
};


exports.joinUserToGroup = async (req, res, next) => {
    //importing variables from req.body
    const userId = req.user.id;
    const workspaceId = req.params.workspaceId;
    const groupId = req.params.groupId;
    const {email} = req.body;

    try {
        // finding current workspace
        const currentWorkspace = await Workspace.findOne({_id: workspaceId} );
        if(!currentWorkspace){
            console.log(`there is no such id:${workspaceId} in the workspace`);
            return res.status(404).json({message: `there is no such id:${workspaceId} in the workspace`});
        }

        // finding all Groups in db
        const allGroups = await Group.find({workspaceId: currentWorkspace._id});
        if(!allGroups) {
            console.log(`this group:${groupId} is not in this ${currentWorkspace._id} workspace`);
            return res.status(404).json({message: `this group:${groupId} is not in this ${currentWorkspace._id} workspace`});
        }

        // finding current group from all groups
        const currentGroup = allGroups.find(item => item.id === groupId);
        if(!currentGroup) {
            return res.status(404).json({message: `not found group with id: ${groupId}`})
        }


        // private case
        if(currentGroup.private) {
            // finding user in group
            const userInGroup = currentGroup.userId.includes(userId);

            if(!userInGroup){
                console.log(`you can't add any user in this group because you-${userId} are not member in this group`);
                return res.status(404).json({message: `you can't add any user in this group because you-${userId} are not member in this group`});
            }
        }

        // not private case
        // search for a user by email from the database
        const user = await User.findOne({email: email});

        // checking is user exist in current Group
        const userExist = currentGroup.userId.includes(user._id);
        if (userExist){
            console.log(`${user.email} user already exist in this group`);
            return res.status(409).json({message: `${user.email} user already exist in this group`});
        }

        // pushing user id to current group user id field
        currentGroup.userId.push(user._id);

        // saving current group
        currentGroup.save();

        // returned result
        console.log(`you added ${user.email} email user to our group: ${currentGroup.name}`);
        return res.status(200).json({message: `you added ${user.email} email user to our group: ${currentGroup.name}`});

    } catch (e) {
        next(e);
    }
};
