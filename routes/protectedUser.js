const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const passport = require('passport');
const bcrypt = require('bcryptjs');

const middleware = require('../lib/middleware');

var User = mongoose.model('users');
const Quote = require('../db/models/quote');

const promises = require('../validation/functionlib');
const userFunctions = require ('../lib/UserFunctions');
const subscriptionFunctions = require('../lib/SubscriptionFunctions');
const stripeFunctions = require('../lib/StripeFunctions');
const invoiceFunctions = require('../lib/InvoiceFunctions');

router.post('/reset-password', middleware.verify, async (req, res) => {
    try {
        const user = await User.findById(req.body.id);
        const isMatch = await bcrypt.compare(req.body.oldPassword, user.password)
        if(!isMatch) {
            return res.status(400).json({data: 'Incorrect Password'})
        }

        const passwordHash = await userFunctions.hashEncrypt(req.body.password)
        user.password = passwordHash;

        const savedUser = await user.save()
        const payload = await promises.stripUserForResolve(savedUser)
        return res.json(payload);
    } catch (error) {
        console.log(error)
        res.sendStatus(500);
    }
});

router.post('/reset-email', middleware.verify, async (req, res) => {
    try {
        const emailInUse = await User.findOne({ email: req.body.email });

        if(emailInUse) {
            return res.status(400).json({data: 'Email already in use'})
        }

        const user = await User.findById(req.body.id);
        user.email = req.body.email
        const savedUser = await user.save()
        const payload = await promises.stripUserForResolve(savedUser)
        res.json(payload);
    } catch (error) {
        console.log(error)
        res.status(500).json({data: 'Internal Server Error'})
    }
});

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

        const newService = {
            name: subscription.name,
            price: subscription.monthly,
        }

        const invoice = await invoiceFunctions.generateInvoice(subscription.name, [newService], true, new Date())
        // TODO: Generate Receipt

        user.invoices.push(invoice);
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

router.post('/pay-invoice', middleware.verify, async (req, res) => {
    try {
        const user = await User.findById(req.body.id);
        const invoices = user.invoices;
        const invoiceToBePaid = await invoiceFunctions.findInvoice(invoices, req.body.invoiceID);
        invoiceFunctions.isPaid(invoiceToBePaid);
        const payment = await stripeFunctions.processStripePayment(user.stripeData.id, invoiceToBePaid.total);
        user.paymentHistory.push(payment);
        const paidInvoice = await invoiceFunctions.markPaid(invoiceToBePaid);
        const newInvoicesList = await invoiceFunctions.findAndReplaceInvoice(invoices, invoiceToBePaid, paidInvoice)
        user.invoices = newInvoicesList;
        user.markModified('invoices')
        const savedUser = await user.save();
        const payload = await promises.stripUserForResolve(savedUser);
        res.json(payload);
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
});

router.post('/quote/add', middleware.verify, async (req, res) => {
    try {
        var user = await User.findById(req.body.id)
        const quote = new Quote({status: 'Pending', websiteType: req.body.websiteType, businessName: req.body.businessName, developmentType: req.body.developmentType, goals: req.body.goals, similarWebsites: req.body.similarSites, notes: req.body.notes, date: new Date()})
        user.quotes.push(quote)
        const savedUser = await user.save();
        const payload = await promises.stripUserForResolve(savedUser);
        res.json(payload);
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
});


module.exports = router