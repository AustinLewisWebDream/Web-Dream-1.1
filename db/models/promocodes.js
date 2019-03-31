const mongoose = require('mongoose');

const Schema = mongoose.Schema;

// Period: 0 = indefinitely
// If ref empty, anyone can use

const PromoCodeSchema = new Schema({
    code: String,
    description: String,
    rate: Number, // Rates expressed as a float percentage (ex. .75 = 75%)
    reccuring: Boolean,
    // Referencing specific users that can use the promo
    ref: []
});

PromoCodeSchema.statics.getRate = async function getRate(promoCode) {
    try {
        const promo = await PromoCode.findOne({code: promoCode});
        return promo.rate;
    } catch (error) {
        console.log(error)
    }  
}


const PromoCode = mongoose.model('promoCode', PromoCodeSchema);

module.exports = PromoCode;