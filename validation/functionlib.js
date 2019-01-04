const stripe = require('stripe')('sk_test_fgs0ulkn4MDVYTm3DtQPZs2M');

async function createUserStripeAccount(id, callback) {
  console.log('method called')
  const customer = await stripe.customers.create({
    description: id,
    source: "tok_amex" // Obtained with stripe.js
  })
  callback(customer);
}


async function findAndRemovePaymentMethod(user, number) {
  var newArr = [];
  if(!user.paymentMethods) {
    console.log("User had no payment methods on file")
    return newArr
  }

  for(var i = 0; i < user.paymentMethods.length; i++) {
    if(user.paymentMethods.length - 1 == i) {
      return newArr;
    }
    if(user.paymentMethods[i].number != number) {
      newArr.push(user.paymentMethods[i])
    }
  }
}

function stripUserForResolve(user) {

  const strippedMethods = stripCreditCardDetails(user.paymentMethods);
  
  const strippedUser = {
    id: user.id,
    subscriptions: user.subscriptions,
    paymentMethods: strippedMethods,
    quotes: user.quotes,
    monthlyRate: user.monthlyRate,
    name: user.name,
    invoices: user.invoices,
    autoRenew: user.autoRenew,
  }
  console.log(strippedUser)
  return strippedUser
}

const stripCreditCardDetails = (paymentMethods) => {
  var strippedMethods = [];
  for(var i = 0; i < paymentMethods.length; i++) {
    const strippedMethod = {
      number: paymentMethods[i].number.substring(12),
      exp_month: paymentMethods[i].exp_month,
      exp_year: paymentMethods[i].exp_year,
      primary: paymentMethods[i].primary
    }
    strippedMethods.push(strippedMethod);
  }
  return strippedMethods;
}

module.exports = {createUserStripeAccount, findAndRemovePaymentMethod, stripUserForResolve}