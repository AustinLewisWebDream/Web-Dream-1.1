const jwt = require('jsonwebtoken');
const options = require('../config');

const verify = (req, res, next) => {
    const bearerHeader = req.headers['authorization'];
    if(typeof bearerHeader !== 'undefined') {
        const bearer = bearerHeader.split(' ');
        const bearerToken = bearer[1];
        jwt.verify(bearerToken, options.secret, function (err, decoded) {
            if(err) 
                return res.sendStatus(403)
            next();
        })

    } else {
        res.sendStatus(403)
    }
}

module.exports = {verify}