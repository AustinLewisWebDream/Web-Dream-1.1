const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('../db/models/User');
const promises = require('../validation/functionlib');
const stripeFunctions = require('../lib/StripeFunctions');
const userFunctions = require('../lib/UserFunctions');
const options = require('../config');

router.post('/register', async (req, res) => {
    const user = await User.findOne({ email: req.body.email });

    if (user) {
        console.log('User was the same')
        return res.status(400).json({data: 'Email already exists'})
    }

    const newUser = new User({
        email: req.body.email,
        autoRenew: false,
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

module.exports = router;