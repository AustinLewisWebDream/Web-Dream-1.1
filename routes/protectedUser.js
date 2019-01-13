const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const passport = require('passport');

const middleware = require('../lib/middleware');

var User = mongoose.model('users');

const promises = require('../validation/functionlib');
const userFunctions = require ('../lib/UserFunctions');
const subscriptionFunctions = require('../lib/SubscriptionFunctions');
const stripeFunctions = require('../lib/StripeFunctions');

router.post('/payment-method/add', middleware.verify, async (req, res) => {
    const newMethod = {number: req.body.number, exp_month: req.body.exp_month, exp_year: req.body.exp_year, cvc: req.body.cvc, primary: Boolean(req.body.makePrimary)}
    try {
        const user = await User.findById(req.body.id);

        if(userFunctions.hasNoPrimaryMethods(user.paymentMethods)) {
            newMethod.primary = true;
        }

        const newStripeCard = await stripeFunctions.addCustomerPaymentMethodToStripe(user.stripeData.id, newMethod)

        if(newMethod.primary) {
            user.paymentMethods = await userFunctions.removeOldPrimaryMethod(user.paymentMethods);
        }

        user.paymentMethods.push(newMethod);
        newMethod.stripeCardToken = newStripeCard.id
        
        const savedUser = await user.save();
        const payload = promises.stripUserForResolve(savedUser)
        res.json(payload)
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
});

router.post('/payment-method/remove', middleware.verify, async (req, res) => {
    try {
        var user = await User.findById(req.body.id)

        const stripeCardToken = await stripeFunctions.getCardTokenFromNumber(user.paymentMethods, req.body.number)
        var newPaymentsList = await promises.findAndRemovePaymentMethod(user, req.body.number);
        console.log(newPaymentsList)

        if(stripeCardToken) {
            const removedToken = await stripeFunctions.removeStripePaymentMethod(user.stripeData.id, stripeCardToken)
        }

        if(userFunctions.hasNoPrimaryMethods(newPaymentsList) && newPaymentsList.length != 0) {
            newPaymentsList = await userFunctions.makePrimaryMethod(newPaymentsList[newPaymentsList.length - 1].number, newPaymentsList);
        }

        user.paymentMethods = newPaymentsList;
        const savedUser = await user.save();
        const payload = promises.stripUserForResolve(savedUser)
        res.json(payload)
    } catch (error) {
        console.log(error)
        return res.sendStatus(500);
    }
});

router.post('/subscription/add', middleware.verify, async (req, res) => {
    try {
        const user = await User.findById(req.body.id);
        const subscription = await subscriptionFunctions.getSubscription(req.body.type, req.body.name);
        const updatedSubscriptions = await userFunctions.pushSubscriptionToAccount(user, subscription);
        const updatedMonthlyRate = await userFunctions.getMonthlyRate(user);
        const stripePayment = await stripeFunctions.processStripePayment(user.stripeData.id, subscription.monthly);
        // TODO: Generate Receipt

        user.subscriptions = updatedSubscriptions;
        user.monthlyRate = updatedMonthlyRate;

        const savedUser = await user.save();
        const payload = await promises.stripUserForResolve(savedUser);
        res.json(payload);
    } catch (error) {
        console.log(error)
        res.sendStatus(500);
    }
});

router.post('/auto-renew', middleware.verify, async (req, res) => {
    try {
        const user = await User.findOneAndUpdate({id: req.body.id}, {autoRenew: req.body.autoRenew});
        const payload = promises.stripUserForResolve(user);
        res.json(payload);
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
});

router.post('/quote/add', middleware.verify, async (req, res) => {
    try {
        var user = await User.findById(req.body.id)
        user.quotes.push(req.body)
        const savedUser = await user.save();
        const payload = await promises.stripUserForResolve(savedUser);
        res.json(payload);
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
});


module.exports = router