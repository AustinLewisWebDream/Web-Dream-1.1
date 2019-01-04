const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const SubscriptionSchema = new Schema({
    type: String,
    name: String,
    monthly: Number,
    quarterly: Number,
    anually: Number,
});

const Subscription = mongoose.model('subscriptions', SubscriptionSchema);

module.exports = Subscription;