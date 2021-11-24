const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('../../models/user.model');
const transporter = require('../../nodemailer/transporter');

exports.signup = async (req, res, next) => {
    const { email } = req.body

    try {
        // Check if the email is in use
        const emailExist = await User.findOne({email}).exec();
        if(emailExist) {
            console.log('Email already in use.');
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
};

exports.login = async (req, res, next) =>{
    const { email } = req.body;

    try {
        // Verify a user with the email exists
        const user = await User.findOne({email}).exec();
        if(!user) {
            console.log('User does not exists');
            return res.status(404).json({message: 'User does not exists'});
        }

        // Checking if password is correct
        const validPassword = await bcrypt.compare(req.body.password, user.password);
        if(!validPassword) {
            console.log('Invalid Password');
            return res.status(400).send('Invalid Password');
        }

        // Ensure the account has been verified
        if(!user.verified) {
            console.log('User is not verified please Verify your Account.');
            return res.status(403).json({message: 'User is not verified please Verify your Account.'});
        }

        // creating and assigning a token
        const token = jwt.sign({ id: user.id }, process.env.SECRET_TOKEN,
            {
                expiresIn: "1h"
            })
        return res.status(200).header('auth-token', token).json({
            token,
            message: 'User logged in'
        })
    } catch (e) {
        next(e);
    }
};
