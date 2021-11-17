const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');

const User = require('../../models/auth.model');

const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD,
    },
})

exports.signup = async (req, res, next) => {
    const { email } = req.body
    console.log(email, 'located in function Signup', 88888888888888888888888888888888888888888888888)

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
    console.log(email, 'located in function login', 88888888888888888888888888888888888888888888888)
    try {
        // Verify a user with the email exists
        const user = await User.findOne({email}).exec()
        if(!user) {
            return res.status(404).json({
                message: 'User does not exists'
            });
        }

        // Checking if password is correct
        const validPassword = await bcrypt.compare(req.body.password, user.password)
        if(!validPassword) {
            return res.status(400).send('Invalid Password');
        }

        // Ensure the account has been verified
        if(!user.verified) {
            console.log('User is not verified please Verify your Account.');
            return res.status(403).json({
                message: 'User is not verified please Verify your Account.'
            })
        }

        // creating and assigning a token
        const token = jwt.sign({ id: user.id }, process.env.SECRET_TOKEN,
            {
                expiresIn: "5m"
            })
        return res.status(200).header('auth-token', token).json({
            token,
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
        console.log('User is not verified please Verify your Account.');
        return res.status(200).json({
            message: 'Account Verified'
        })
    } catch (e) {
        next(e);
    }
}