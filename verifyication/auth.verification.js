const jwt = require("jsonwebtoken");
const User = require("../models/auth.model");

exports.verify = async (req, res, next) =>{
    // Check we have an id
    const { id } = req.params

    if(!id) {
        console.log('Missing Token')
        return res.status(422).json({message: 'Missing Token'})
    }

    // Verify the token from the URL
    let payload = null
    try {
        payload = jwt.verify(id, process.env.USER_VERIFICATION_TOKEN_SECRET);
    } catch (e) {
        next(e);
    }

    try {
        // Find user with matching ID
        const user = await User.findOne({_id: payload.ID}).exec();
        if(!user){
            console.log('User is not Found')
            return res.status(404).json({message: 'User is not Found'});
        }

        // Update user verification status to true
        user.verified = true;
        await user.save();

        console.log('Account Verified');
        return res.status(200).json({message: 'Account Verified'});
    } catch (e) {
        next(e);
    }
};