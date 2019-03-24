const stripe = require('stripe')('sk_test_fgs0ulkn4MDVYTm3DtQPZs2M');
const secure = require('../encryption');

const createCustomerStripeAccount = async (user) => {
    try {
        const userStripeData = await stripe.customers.create({
            description: 'Customer for ' + user.email,
            email: user.email,
            source: 'tok_amex'
        });
        return userStripeData
    } catch (error) {
        console.log('Unable to create stripe customer')
        console.log(error)
    }    
}

const processStripePayment = async (userStripeID, chargeAmount) => {
    try {
        const charge = await stripe.charges.create({
            amount: chargeAmount * 100,
            currency: 'usd',
            customer: userStripeID
        })
        return charge;
    } catch (error) {
        console.log(error)
        throw 'Unable to process stripe payment'
    }
}

const addCustomerPaymentMethodToStripe = async (userStripeID, paymentMethod) => {
    try {
        const card = await stripe.customers.createSource(
            userStripeID,
            { 
                source: {
                    object: 'card',
                    number: paymentMethod.number,
                    exp_month: paymentMethod.exp_month,
                    exp_year: paymentMethod.exp_year,
                    cvc: paymentMethod.cvc,
                    currency: 'usd',
                }
            }
        )
        if(paymentMethod.primary) {
            const updatedCustomer = await updateStripeCustomer(userStripeID, {default_source: card.id});
            console.log('Customer default payment method updated')
        }
        return card;
    } catch (error) {
        console.log(error)
        throw 'Unable to add payment method to user account'
    }
}

const removeStripePaymentMethod = async (userStripeID, paymentMethodID) => {
    try {
        const removedPaymentMethod = await stripe.customers.deleteCard(
            userStripeID,
            paymentMethodID
        )
        return removedPaymentMethod;
    } catch(error) {
        console.log(error)
    }
}

const getCardTokenFromNumber = async (paymentMethods, cardNumber) => {
    var stripeCardToken;
    for(var i = 0; i < paymentMethods.length; i++) {
        const decryptedCardNumber = secure.decrypt(paymentMethods[i].number)
        if(decryptedCardNumber == cardNumber) {
            stripeCardToken = paymentMethods[i].stripeCardToken;
        }
    }
    return stripeCardToken;
}

const updateStripeCustomer = async (customerID, updatesObject) => {
    try {
        const updatedCustomer = await stripe.customers.update(
            customerID,
            updatesObject
        )
    } catch (error) {
        console.log(err)
        throw 'Unable to update customer'
    }
}

module.exports = { createCustomerStripeAccount, processStripePayment, addCustomerPaymentMethodToStripe, removeStripePaymentMethod, getCardTokenFromNumber }