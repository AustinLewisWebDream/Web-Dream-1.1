const mongoose = require('mongoose');
const shortid = require('shortid');

const Schema = mongoose.Schema;

const QuoteSchema = new Schema({
    shortID: {
        type: String,
        default: shortid.generate
    },    // Shorter and more readable for customers
    status: String,
    websiteType: String,
    businessName: String,
    developmentType: String,
    goals: String,
    similarWebsites: String,
    notes: String,
    date: Date,
    price: Number
});

const Quote = mongoose.model('quote', QuoteSchema);

module.exports = Quote;