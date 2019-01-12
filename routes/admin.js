const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

var User = mongoose.model('users');
var Sub = require('../db/models/subscriptions')
const nodeJobs = require('../lib/NodeCron');


var now = new Date();
const fakeService = {
    name: 'Starter',
    price: 4,
    dueDate: new Date(now.getFullYear(), now.getMonth(), now.getDate())
}




router.post('/subscription/create', (req, res) => {
    console.log('Subscription About to be added')
    console.log(req.body)
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

module.exports = router;