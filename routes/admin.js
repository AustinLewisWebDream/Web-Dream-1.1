const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

var User = mongoose.model('users');
var Sub = require('../db/models/subscriptions')
var Quote = require('../db/models/quote');

const nodeJobs = require('../lib/NodeCron');
const PromoCode = require('../db/models/promocodes');

const middleware = require('../lib/middleware');


// TODO: Fix authentication for admin routes

var now = new Date();
const fakeService = {
    name: 'Starter',
    price: 4,
    dueDate: new Date(now.getFullYear(), now.getMonth(), now.getDate())
}

router.post('/promocode/create' , async (req, res) => {
    const newPromo = await PromoCode.create({code: req.body.code, description: req.body.description, rate: req.body.rate, reccuring: Boolean(req.body.reccuring) })
    res.status(200).json({data: newPromo});
});


router.post('/subscription/create', (req, res) => {
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

router.post('/genfakeinvoice', async (req, res) => {
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

router.post('/genfakeservices', async (req, res) => {
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

const verifyAdmin = (req, res, next) => {
    if(req.body.adminEmail != 'opticsillusion@live.com') {
        return res.status(403);
    } else {
        next();
    }
}

router.post('/authenticate', middleware.verify, async (req, res) => {
    return res.status(200).json({isAdmin: true});
})

router.post('/get-users', middleware.verify, async (req, res) => {
    console.log("This route was hit")
    try {
        const users = await User.find({});
        return res.status(200).json(users);
    } catch (error) {
        console.log(error);
        res.status(500);
    }
})

router.post('/update-customer/quote', async (req, res) => {
    var customer = await User.findById(req.body.customerID);
    let newQuotesList = await customer.findQuoteByIdAndUpdate(req.body.id, req.body.updated);
    customer.quotes = newQuotesList;
    customer.markModified('quotes')
    await customer.save();
    res.sendStatus(200);
})

module.exports = router;