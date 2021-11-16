const { validationResult } = require('express-validator');

function errorHandler(req, res, next) {
    const errors = validationResult(req)

    if (!errors.isEmpty()){
        return res.status(400).json({errors: errors.array().filter((message) => {
            res.json(message.msg.message)
            })
        })
    }
    return next();
}

module.exports = { errorHandler };