const mongoose = require('mongoose');
const stripe = require('stripe')('sk_test_fgs0ulkn4MDVYTm3DtQPZs2M');

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
    status: {
        type: String,
        default: 'normal'
    },
    tempToken: {},
    stripeData: {},
    quotes: [],
    subscriptions: [],
    paymentMethods: [],
    invoices: [],
    paymentHistory: []
});

UserSchema.methods.makePayment = async function makePayment(amount) {
    console.log(amount)
    try {
        const charge = await stripe.charges.create({
            amount: Math.round(amount * 100),
            currency: 'usd',
            customer: this.stripeData.id
        })
        this.paymentHistory.push(charge);
        return this;
    } catch (error) {
        console.log(error)
        throw 'Unable to process stripe payment'
    }
}

UserSchema.methods.updateMonthlyRate = async function updateMonthlyRate() {
    var updatedMonthlyRate = 0;
    for(var i = 0; i < this.subscriptions.length; i++) {
        updatedMonthlyRate += Number(this.subscriptions[i].subscription.monthly);
        if(i === this.subscriptions.length - 1) {
            return updatedMonthlyRate;
        }
    }
}

UserSchema.methods.findQuoteByIdAndUpdate = async function findQuoteByIdAndUpdate(quoteID, newQuote) {
    var newQuotes = this.quotes
    for(var i = 0; i < this.quotes.length; i++) {
        if(this.quotes[i]._id == quoteID) {
            
            newQuotes[i] = newQuote;
            return newQuotes;
        }
    }
    return null
}

UserSchema.methods.findQuoteById = async function findQuoteById(quoteID) {
    for(var i = 0; i < this.quotes.length; i++) {
        if(this.quotes[i]._id == quoteID) {
            return this.quotes[i];
        }
    }
    return null
}

UserSchema.methods.findAndReplaceQuote = async function findAndReplaceQuote(quoteID, newQuote) {
    var newQuotes = this.quotes;
    for(var i = 0; i < this.quotes.length; i++) {
        if(this.quotes[i]._id == quoteID) {
            newQuotes[i] = newQuote;
            return newQuotes;
        }
    }
    return null
}

const User = mongoose.model('users', UserSchema);

module.exports = User;