const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');

const User = require('../models/user.model');

const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD,
    },
})

exports.signup = async (req, res, next) => {
    const { email } = req.body
    console.log(email, 8888888888)

    try {
        // Check if the email is in use
        const emailExist = await User.findOne({email}).exec();
        if(emailExist) {
            return res.status(409).json('Email already in use.');
        }

        //Hashing Password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(req.body.password, salt);

        // Creating and saving the user
        const user = await new User({
            email: email,
            name: req.body.name,
            password: hashedPassword
        })
            user.save();

        // Generating a verification token with the user's ID
        const verificationToken = user.generateVerificationToken();
        // Email the user a unique verification link
        const url = `http://localhost:3000/verify/${verificationToken}`

        await transporter.sendMail({
            to: email,
            subject: 'Verify Account',
            html: `Click <a href = '${url}'>here</a> to confirm your email.`
        })
        return res.status(201).json({
            message: `Sent a verification email to ${email}`
        })
    } catch (e) {
        next(e)
    }
}

exports.login = async (req, res, next) =>{
    const { email } = req.body

    try {
        // Verify a user with the email exists
        const user = await User.findOne({email}).exec()
        if(!user) {
            return res.status(404).json({
                message: 'User does not exists'
            });
        }

        // Ensure the account has been verified
        if(!user.verified) {
            return res.status(403).json({
                message: 'User is not verified please Verify your Account.'
            })
        }
        return res.status(200).json({
            message: 'User logged in'
        })
    } catch (e) {
        next(e);
    }
}

exports.verify = async (req, res, next) =>{
    // Check we have an id
    const { id } = req.params

    if(!id) {
        return res.status(422).json({
            message: 'Missing Token'
        })
    }

    // Verify the token from the URL
    let payload = null
    try {
        payload = jwt.verify(
            id,
            process.env.USER_VERIFICATION_TOKEN_SECRET
        );
    } catch (e) {
        next(e);
    }

    try {
        // Find user with matching ID
        const user = await User.findOne({_id: payload.ID}).exec();
        if(!user){
            return res.status(404).json({
                message: 'User is not Found'
            });
        }

        // Update user verification status to true
        user.verified = true;
        await user.save();
        return res.status(200).json({
            message: 'Account Verified'
        })
    } catch (e) {
        next(e);
    }
}