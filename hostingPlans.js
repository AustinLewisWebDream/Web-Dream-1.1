const mongoose = require('mongoose')
const Subscription = require('./db/models/subscriptions');

starter = {
    name: 'Starter',
    type: 'hosting',
    monthly: 4
}
business = {
    name: 'Business',
    type: 'hosting',
    monthly: 8 
}
hyper = {
    name: 'Hyper',
    type: 'hosting',
    monthly: 15
}

const createPlans = () => {
    Subscription.create(starter)
    Subscription.create(business)
    Subscription.create(hyper)
}

module.exports =  { createPlans } 

