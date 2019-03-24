const mongoose = require('mongoose');

const Schema = mongoose.Schema;

// Period: 0 = indefinitely

const PromoCodeSchema = new Schema({
    code: String,
    description: String,
    rate: Number, // Rates expressed as a float percentage (ex. .75 = 75%)
    reccuring: Boolean,
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