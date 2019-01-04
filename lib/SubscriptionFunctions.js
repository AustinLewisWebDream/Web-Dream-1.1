const mongoose = require('mongoose');
const Subscription = require('../db/models/subscriptions');

const getSubscription = async (type, name) => {
    try {
        subscription = await Subscription.findOne({type: type, name: name});
        return subscription;
    } catch (error) {
        console.log('Subscription')
    }
}

module.exports = { getSubscription }