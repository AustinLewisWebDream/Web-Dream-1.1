const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const QuoteSchema = new Schema({
    status: String,
    websiteType: String,
    businessName: String,
    developmentType: String,
    goals: String,
    similarWebsites: String,
    notes: String,
    date: Date
});

const Quote = mongoose.model('quote', QuoteSchema);

module.exports = Quote;