const mongoose = require('mongoose');
const Subscription = require('./subscriptions');
const Promo = require('./promocodes');
const cycles = require('../../lib/cycles');

const Schema = mongoose.Schema;

const ServiceSchema = new Schema({
    subscription: {type: mongoose.Schema.Types.ObjectId, ref: 'Subscription'},
    renewDate: Date,
    renewCycle: String,
});

ServiceSchema.methods.calculateCharge = async function (promo) {
    try {
        var promoRate = 1;
        const subscription = await Subscription.findById(this.subscription);
        const monthlyAmount = subscription.monthly;
        const numberOfMonthsInCycle = cycles.getNumMonths(this.renewCycle);
        const cycleDiscount = cycles.getCycleDiscount(this.renewCycle);
        if(promo !== undefined && promo !== '') {
            promoRate = await Promo.getRate(promo);
        }
        return monthlyAmount * numberOfMonthsInCycle * cycleDiscount * promoRate; 
    } catch (error) {
        console.log(error);
        console.log('Subscription Unable to be found with the provided ID')
        return 0;
    }
}

ServiceSchema.methods.getRawTotal = async function() {
    const subscription = await Subscription.findById(this.subscription);
    return subscription.monthly * cycles.getNumMonths(this.renewCycle);
}

ServiceSchema.methods.getPromoDiscount = async function(promo) {
    try {
        var promoRate = 1;
        const subscription = await Subscription.findById(this.subscription);
        const monthlyAmount = subscription.monthly;
        const numberOfMonthsInCycle = cycles.getNumMonths(this.renewCycle);
        const cycleDiscount = cycles.getCycleDiscount(this.renewCycle);
        if(promo !== undefined && promo !== '') {
            promoRate = await Promo.getRate(promo);
        }
        const total = monthlyAmount * numberOfMonthsInCycle * cycleDiscount * promoRate; 
        const subTotal = monthlyAmount * numberOfMonthsInCycle * cycleDiscount
        return subTotal - total;
    } catch (error) {
        console.log(error);
        console.log('Subscription Unable to be found with the provided ID')
        return 0;
    }
}

ServiceSchema.methods.setNextRenewDate = async function() {
    const today = new Date();
    const nextDate = new Date(today.getFullYear(), today.getMonth() + cycles.getNumMonths(this.renewCycle), today.getDate());
    this.date = nextDate;
    await this.save();
}



const Service = mongoose.model('services', ServiceSchema);

module.exports = Service;