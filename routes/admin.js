const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

var User = mongoose.model('users');
var Sub = require('../db/models/subscriptions')
const nodeJobs = require('../lib/NodeCron');


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

router.post('/scheduleJob', (req, res) => {
    nodeJobs.scheduleNewJob();
    console.log('Job was scheduled');
    res.sendStatus(200);
})

module.exports = router;