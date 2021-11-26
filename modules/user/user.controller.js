const Workspace = require("../../models/workspace.model");
const User = require('../../models/user.model');
const transporter = require('../../nodemailer/transporter');

exports.createWorkspace = async (req, res, next) => {

    try {
        // Creating and saving the workspace
        const workspace = await new Workspace({
            idMembers: req.user.id,
            workspaceName: req.body.workspaceName,
        })
        const _id = workspace.idMembers;

        // adding new workspaces id`s in user workspaceId
        const user = await User.findById({_id});
        let addingIds = user.workSpaceId.push(workspace._id);

        // inserting workspaceId to user workspaceId`s and updating user
        await User.findByIdAndUpdate({_id},
            {
                ...req.body,
                workSpaceId: user.workSpaceId,
            },
        );

        workspace.save();
        
        console.log(`${req.body.workspaceName} Workspace is created`);
        return res.status(200).json({message: `${req.body.workspaceName} Workspace is created`});

    } catch (e) {
        next(e);
    }
};


exports.inviteUser = async (req, res, next) => {
    const {email} = req.body;
    const workspaceId = req.params.id;
    const userId = req.user.id;

    try {
        // finding current workspace id in db
        let workspace = await Workspace;
        workspace = await workspace.findOne({_id: workspaceId});

        if (!workspace) {
            console.log(`${workspaceId} workspace Id not found`);
            return res.status(404).json({message: `${workspaceId} workspace Id not found`});
        }

        findUserIdInCurrentWorkspaceIdMembers = workspace.idMembers.includes(userId);

        if(!findUserIdInCurrentWorkspaceIdMembers) {
            console.log(`not found ${userId} in workspace idMembers`);
            return res.status(404).json({message: `not found ${userId} in workspace idMembers`});
        }

        let user = await User.findOne({_id: userId});
        //finding current user for creating jwt token
        // Generating a verification token with the user's ID
        const verificationToken = await user.generateVerificationToken();
        // Email the user a unique verification link
        const url = `http://localhost:3000/invite/${verificationToken}`;

        // finding id recipient email
        user = await User.findOne({email: email});

        const exist = user.workSpaceId.includes(workspaceId);

        if(exist){
            console.log(`workspace Id: ${workspaceId} already exist in user workspaceId`);
            return res.status(409).json({message: `workspace Id: ${workspaceId} already exist in user workspaceId`});
        }

        const recipient = user._id;

        let isExistRecipientIdInIdMembers = workspace.idMembers.includes(recipient);

        if(isExistRecipientIdInIdMembers) {
            console.log(`id ${recipient} already exists in id Members `);
            return res.status(409).json({message: `id ${recipient} already exists in id Members `});
        }

        await transporter.sendMail({
            to: email,
            subject: 'invitation',
            html: `Click <a href = '${url}'>here</a> to confirm your email.`
        });

        exports.emailRecipient = {
            id: user._id,
            user: user,
            workspace: workspace
        };

        console.log(`Sent a verification email to ${email}`);
        return res.status(201).json({message: `Sent a verification email to ${email}`});
    } catch (e) {
        next(e)
    }
};