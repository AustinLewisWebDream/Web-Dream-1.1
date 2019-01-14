const mongoose = require('mongoose');
const User = require('../db/models/User');
const bcrypt = require('bcryptjs');


const pushInvoiceToAccount = (user, invoice) => {
    var updatedInvoices = user.invoices;
    try {
        updatedInvoices.push(invoice)
        return updatedInvoices;
    } catch (error) {
        console.log('Unable to push invoice to account')
        console.log(error);
    }
}

const getRenewDate = () => { 
    const now = new Date();
    const nextDueDate = new Date(now.getFullYear(), now.getMonth()+1, now.getDate())
    return nextDueDate;
}

const pushSubscriptionToAccount = (user, newSubscription) => {
    user.subscriptions.push(
        {
            renewDate: getRenewDate(),
            subscription: newSubscription
        }
    )
    return user.subscriptions;
}

const getMonthlyRate = (user) => {
    var updatedMonthlyRate = 0;
    for(var i = 0; i < user.subscriptions.length; i++) {
        updatedMonthlyRate += Number(user.subscriptions[i].subscription.monthly);
        if(i === user.subscriptions.length - 1) {
            return updatedMonthlyRate;
        }
    }
}

const hashEncrypt = async (password) => {
    try {
        const salt = await bcrypt.genSalt(10);
        const hashedResult = await bcrypt.hash(password, salt);
        return hashedResult;
    } catch(error) {
        console.log(error)
    }
}

const removeOldPrimaryMethod = async (paymentMethods) => {
    var updatedPaymentMethodList = paymentMethods;
    for(var i = 0; i < paymentMethods.length; i++) {
        if(paymentMethods[i].primary) {
            updatedPaymentMethodList[i].primary = false;
        }   
    }
    return updatedPaymentMethodList;
}

const makePrimaryMethod = async (newMethodNumber, paymentMethods) => {
    var updatedPaymentMethodList = paymentMethods;
    for(var i = 0; i < paymentMethods; i++) {
        if(paymentMethods[i].number == newMethodNumber) {
            updatedPaymentMethodList.primary = true; 
        }
    }
    return updatedPaymentMethodList;
}

const hasNoPrimaryMethods = async (paymentMethods) => {
    for(var i = 0; i < paymentMethods; i++) {
        if(paymentMethods[i].primary) {
            return false;        
        }
    }
    return true;
}

module.exports = { pushInvoiceToAccount, pushSubscriptionToAccount, getRenewDate, getMonthlyRate, hashEncrypt, makePrimaryMethod, removeOldPrimaryMethod, hasNoPrimaryMethods }