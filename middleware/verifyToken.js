const jwt = require('jsonwebtoken');

module.exports = function (req, res, next) {
    try {
        const token = req.header('auth-token');
        if(!token) return res.status(401).send('Access Denied');

        req.user = jwt.verify(token, process.env.SECRET_TOKEN);

        next();
    } catch (e) {
        return res.status(400).send('Invalid Token');
    }
};