const { Schema, model} = require('mongoose');
const jwt = require('jsonwebtoken');

const User = new Schema({
    email: {
        type: String,

    },

    verified: {
        type: Boolean,
        required:true,
        default: false
    },

    name: {
        type: String,
        required: true
    },

    password: {
        type: String,
        required: true
    },

});

User.methods.generateVerificationToken = function () {
    const user = this;

    const verifyToken = jwt.sign(
        {ID: user._id},
        process.env.USER_VERIFICATION_TOKEN_SECRET,
        {expiresIn: "10m"}
    )
    return verifyToken
}

module.exports = model('User', User);