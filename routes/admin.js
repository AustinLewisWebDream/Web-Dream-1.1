const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
var User = mongoose.model('users');
var Sub = require('../db/models/subscriptions')
var Quote = require('../db/models/quote');
const nodeJobs = require('../lib/NodeCron');
const PromoCode = require('../db/models/promocodes');
const middleware = require('../lib/middleware');

const verifyAdmin = async (req, res, next) => {
    try {
        const account = await User.findById(req.body.id);
        if(account.email == 'austin@webdreamtech.com')
            next();
        else
            res.status(403);
    } catch(err) {
        res.status(500);            
    }
}


var now = new Date();
const fakeService = {
    name: 'Starter',
    price: 4,
    dueDate: new Date(now.getFullYear(), now.getMonth(), now.getDate())
}

router.post('/promocode/create', middleware.verify, verifyAdmin, async (req, res) => {
    const newPromo = await PromoCode.create({code: req.body.code, description: req.body.description, rate: req.body.rate, reccuring: Boolean(req.body.reccuring) })
    res.status(200).json({data: newPromo});
});


router.post('/subscription/create',  middleware.verify, verifyAdmin, (req, res) => {
    let newSub = new Sub({
        type: req.body.type,
        name: req.body.name,
        monthly: Number(req.body.monthly),
        quarterly: Number(req.body.quarterly),
        anually: Number(req.body.anually)
    });
    newSub.save().then(subscription => {
        res.json(subscription)
    }).catch(err => {
        console.log(err)
    })
});

router.post('/genfakeinvoice', middleware.verify, verifyAdmin, async (req, res) => {
    var currentDate = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    const newInvoice = {
        invoiceNumber: 12331256131,
        name: 'opticsillusion@live.com',
        services: [fakeService],
        total: 50,
        paid: false,
        dueDate: currentDate
    }
    const me = await User.findOne({email: 'opticsillusion@live.com'});
    me.invoices.push(newInvoice);
    const savedMe = await me.save();
    res.json(savedMe);
});

router.post('/genfakeservices',  middleware.verify, verifyAdmin, async (req, res) => {
    const me = await User.findOne({email: 'opticsillusion@live.com'});
    const subscription = await Sub.findOne({type: 'hosting'});

    var now = new Date();
    const fakeService = {
        renewDate: new Date(now.getFullYear(), now.getMonth(), now.getDate()+7),
        subscription: subscription
    }

    me.subscriptions.push(fakeService);
    const savedMe = await me.save();
    res.json(savedMe);
});

router.post('/scheduleJob', (req, res) => {
    nodeJobs.scheduleInvoiceGeneration();
    console.log('Job was scheduled');
    res.sendStatus(200);
})


// START FULLY IMPLEMENTED ROUTES --------------------------



router.post('/authenticate', middleware.verify, verifyAdmin, async (req, res) => {
    return res.status(200).json({data: true});
})

router.post('/get-users', middleware.verify, verifyAdmin, async (req, res) => {
    try {
        const users = await User.find({});
        return res.status(200).json(users);
    } catch (error) {
        console.log(error);
        res.status(500);
    }
})

router.post('/update-customer/quote', middleware.verify, verifyAdmin, async (req, res) => {
    console.log(req.body)
    var customer = await User.findById(req.body.customerID);
    var newQuotesList = await customer.findQuoteByIdAndUpdate(req.body.quoteID, req.body.updated);
    console.log(newQuotesList)
    customer.quotes = newQuotesList;
    customer.markModified('quotes')
    await customer.save();
    res.sendStatus(200);
})

module.exports = router;