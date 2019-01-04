const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const QuoteSchema = new Schema({

    

});

const Quote = mongoose.model('quote', QuoteSchema);

module.exports = Quote;