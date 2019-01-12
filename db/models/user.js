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
    autoRenew : {
        type: Boolean,
        default: true,
    },
    stripeData: {},
    quotes: [],
    subscriptions: [],
    paymentMethods: [],
    invoices: [],
    paymentHistory: []
});

const User = mongoose.model('users', UserSchema);

module.exports = User;