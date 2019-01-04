const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const UserSchema = new Schema({
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    },
    monthlyRate : {
        type: Number,
        default: 0
    },
    stripeData: {},
    quotes: [],
    subscriptions: [],
    paymentMethods: [],
    invoices: [],
    autoRenew: Boolean
});

const User = mongoose.model('users', UserSchema);

module.exports = User;