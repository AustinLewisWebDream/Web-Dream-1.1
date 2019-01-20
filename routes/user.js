const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('../db/models/User');
const promises = require('../validation/functionlib');
const stripeFunctions = require('../lib/StripeFunctions');
const userFunctions = require('../lib/UserFunctions');
const mailer = require('../lib/MailFunctions');
const options = require('../config');

router.post('/register', async (req, res) => {
    const user = await User.findOne({ email: req.body.email });

    if (user) {
        console.log('User was the same')
        return res.status(400).json({data: 'Email already exists'})
    }

    const newUser = new User({
        email: req.body.email,
        password: req.body.password,
    });

    try {
        const passwordHash = await userFunctions.hashEncrypt(req.body.password)
        const userStripeAccount = await stripeFunctions.createCustomerStripeAccount(newUser);
    
        newUser.password = passwordHash;
        newUser.stripeData = userStripeAccount;

        const savedUser = await newUser.save()
        const payload = await promises.stripUserForResolve(savedUser)

        res.json(payload);
    } catch(error) {
        console.log(error) 
        res.sendStatus(500);
    }
});


router.post('/login', async (req, res) => {
    const email = req.body.email;
    const password = req.body.password;

    const user = await User.findOne({ email })
    if(!user) 
        return res.status(400).json({data: 'User not found'})
    
    try {
        const isMatch = await bcrypt.compare(password, user.password)
        if(!isMatch) {
            res.status(400).json({data: 'Incorrect Password'})
        }
        const payload = promises.stripUserForResolve(user)
        jwt.sign(payload, options.secret, {
            expiresIn: 3600
        }, (err, token) => {
            if(err) {res.sendStatus(500)}
            else {
                res.json({
                    success: true,
                    token: `Bearer ${token}`
                })
            }
        })
    } catch(error) {
        console.log(error)
        res.sendStatus(500);
    }
});

router.post('/recover-password', async (req, res) => {
    console.log('Recover password route hit')
    try {
        const user = await User.findOne({ email: req.body.email });
        if(user == null) {
            return res.status(400).json({data: 'Email not found'})
        }
        const token = await promises.genToken();
        user.tempToken = token;
        const savedUser = await user.save();
        await mailer.sendPasswordReset(user.email, token);
        res.status(200);
    } catch (error) {
        console.log(error)
        res.status(500).json({data: 'Internal server error'})
    }
}); 

router.post('/verify-token', async (req, res) => {
    const user = await User.findOne({ email: req.body.email });
    const token = req.body.token;
    const newPassword = req.body.password;
    if(!promises.verifyToken(token, user.tempToken)) {
        return res.status(400).json({data: 'Incorrect token'})
    }
    try {
        user.token = { time: null, token: null, password: null }
        user.password = await userFunctions.hashEncrypt(newPassword);
        const savedUser = await user.save();
        res.status(200).json({data: 'Password Successfully Reset'});
    } catch (error) {
        console.log(error);
        res.status(500).json({data: 'Internal server error'})
    }
});

module.exports = router;