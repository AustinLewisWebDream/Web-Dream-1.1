const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const middleware = require('../lib/middleware');

var User = mongoose.model('users');
const Quote = require('../db/models/quote');
const Service = require('../db/models/service');
const Subscription = require('../db/models/subscriptions')
const PromoCode = require('../db/models/promocodes');

const promises = require('../validation/functionlib');
const userFunctions = require ('../lib/UserFunctions');
const subscriptionFunctions = require('../lib/SubscriptionFunctions');
const stripeFunctions = require('../lib/StripeFunctions');
const invoiceFunctions = require('../lib/InvoiceFunctions');
const secure = require('../encryption');
const mailer = require('../lib/MailFunctions');

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
        const token = await promises.genJWT(payload);
        res.json(token);
    } catch (error) {
        console.log(error)
        res.sendStatus(500);
    }
});

router.post('/reset-email', middleware.verify, async (req, res) => {
    try {
        const alreadyUsed = await User.findOne({ email: req.body.email });
        if(alreadyUsed) {
            return res.status(400).json({data: 'Email already in use'})
        }
        const user = await User.findById(req.body.id);
        user.email = req.body.email
        const savedUser = await user.save()
        const payload = await promises.stripUserForResolve(savedUser)
        const token = await promises.genJWT(payload);
        res.json(token);
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
        const encryptedCardNumber = secure.encrypt(newMethod.number);
        newMethod.number = encryptedCardNumber;
        user.paymentMethods.push(newMethod);
        
        newMethod.stripeCardToken = newStripeCard.id
        
        const savedUser = await user.save();
        const payload = promises.stripUserForResolve(savedUser)
        const token = await promises.genJWT(payload);
        res.json(token);
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

        if(stripeCardToken) {
            const removedToken = await stripeFunctions.removeStripePaymentMethod(user.stripeData.id, stripeCardToken)
        }

        if(userFunctions.hasNoPrimaryMethods(newPaymentsList) && newPaymentsList.length != 0) {
            newPaymentsList = await userFunctions.makePrimaryMethod(newPaymentsList[newPaymentsList.length - 1].number, newPaymentsList);
        }

        user.paymentMethods = newPaymentsList;
        const savedUser = await user.save();
        const payload = promises.stripUserForResolve(savedUser)
        const token = await promises.genJWT(payload);
        res.json(token);
    } catch (error) {
        console.log(error)
        return res.sendStatus(500);
    }
});


router.post('/subscription/add', middleware.verify, async (req, res) => {
    var invoiceItems = [];
    try {
        // Find user and subscription
        const user = await User.findById(req.body.id);
        const subscription = await Subscription.findOne({name: req.body.name});

        // Create new service and add to the user's account
        const service = new Service({subscription: subscription._id, renewDate: new Date(), renewCycle: req.body.cycle}) 
        user.subscriptions.push(service);

        invoiceItems.push({name: subscription.name, price: await service.getRawTotal()});
        
        // If the user used a discount, push discount to invoice items
        if(req.body.promo !== '' && req.body.promo !== undefined){
            invoiceItems.push({name: req.body.promo, price: await service.getPromoDiscount(req.body.promo)});
        }

        const amount = await service.calculateCharge(req.body.promo);

        // Charge the user
        await user.makePayment(amount);

        await service.setNextRenewDate();

        // Create an invoice
        const invoice = await invoiceFunctions.generateInvoice(invoiceItems, true, new Date());
        user.invoices.push(invoice);

        // Send email to user with invoice
        await mailer.sendReceipt(user.email, invoice)

        // Save and send user
        user.markModified('subscriptions')
        const savedUser = await user.save();
        const payload = await promises.stripUserForResolve(savedUser);
        const token = await promises.genJWT(payload);
        res.json(token);
    } catch (error) {
        console.log(error)
        res.sendStatus(500);
    }
});

router.post('/auto-renew', middleware.verify, async (req, res) => {
    try {
        var user = await User.findById(req.body.id);
        user.autoRenew = (Boolean(req.body.autoRenew))
        user = await user.save();
        const payload = await promises.stripUserForResolve(user);
        const token = await promises.genJWT(payload);
        res.json(token);
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

        await mailer.sendReceipt(invoice, email)
        const newInvoicesList = await invoiceFunctions.findAndReplaceInvoice(invoices, invoiceToBePaid, paidInvoice)
        user.invoices = newInvoicesList;
        user.markModified('invoices')
        const savedUser = await user.save();
        const payload = await promises.stripUserForResolve(savedUser);
        const token = await promises.genJWT(payload);
        res.json(token);
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
        const token = await promises.genJWT(payload);
        res.json(token);
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
});

router.post('/verify-promo', async (req, res) => {
    try{
        const promoCode = await PromoCode.findOne({code: req.body.code})
        console.log(promoCode)
        if(!promoCode) {
            return res.status(400).json({data: 'Promo code has expired or could not be found'});
        }
        return res.status(200).json({data: promoCode});
    } catch(error) {
        console.log(error)
        res.status(500).json({data: 'Internal server error'})
    }
});

router.post('/quote/accept', middleware.verify, async (req, res) => {
    var invoiceItems = [];
    try{
        var user = await User.findById(req.body.id)
        var newQuote = await user.findQuoteById(req.body.quoteID);
        newQuote.status = 'Accepted';
        
        user.quotes = await user.findAndReplaceQuote(req.body.quoteID, newQuote);
        user.markModified('quotes')
        invoiceItems.push({name: 'Development Services', price: newQuote.price});
        const invoice = await invoiceFunctions.generateInvoice(invoiceItems, false, new Date());
        user.invoices.push(invoice);
        // TODO: Generate promo code based on invoice number
        const savedUser = await user.save();
        const payload = await promises.stripUserForResolve(savedUser);
        console.log(savedUser);
        const token = await promises.genJWT(payload);
        res.json(token);
    } catch(err) {
        console.log(err)
        res.status(500)
    }
});

module.exports = router