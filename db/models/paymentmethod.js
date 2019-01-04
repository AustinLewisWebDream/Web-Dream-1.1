const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const PaymentSchema = new Schema({
    
    

});

const PaymentMethod = mongoose.model('payment', PaymentSchema);

module.exports = PaymentMethod;