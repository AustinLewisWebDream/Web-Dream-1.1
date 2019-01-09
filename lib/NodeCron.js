const schedule = require('node-schedule');
const shortid = require('shortid');
const stripefunctions = require('../lib/StripeFunctions');

const mongoose = require('mongoose');

var User = mongoose.model('users');

const scheduleNewJob = async () => {
    var now = new Date();
    var current = new Date(now.getFullYear(), now.getMonth()+1, now.getDate())

    // Job run format 'minute hour dayOfMonth month dayOfWeek'
    // Run job every minute */1 * * * *
    // Run job every hour on the 42nd minute of the hour 42 * * * *
    var invoiceGenerationSchedule = schedule.scheduleJob('*/30 * * * * *', async function() {
        const accounts = await User.find({});

        generateInvoices(accounts);
        processPayments(accounts);
        console.log('Invoice Generation Job Ran');
    });
}

const generateInvoices = async(accounts) => {
    for(var i = 0; i < accounts.length; i++) {
        console.log('The loop account loop was hit')
        var services = [];
        var total = 0;
        for(var j = 0; j < accounts[i].subscriptions.length; j++) {
            const subscription = accounts[i].subscriptions[j].subscription;
            total += subscription.monthly;
            services.push({name: subscription.name, price: subscription.price, renewDate: accounts[i].subscriptions[j].renewDate})
        }   
            console.log('New invoice pushed for ', accounts[i].email)
            const newInvoice = {
                invoiceNumber: shortid.generate(),
                name: accounts[i].email,
                services: services,
                total: total,
                paid: false
            }
            accounts[i].invoices.push(newInvoice);
            const saved = await accounts[i].save();
    }
}

const processPayments = async (accounts) => {
    console.log('Process payment route')
    for(var i = 0; i < accounts.length; i++) {
        for(var j = 0; j < accounts[i].invoices.length; j++) {
            console.log('The second process payment loop was hit')
            const invoice = accounts[i].invoices[j]
            if(invoice.paid) {
                continue;
            }
            if(!accounts[i].autoRenew)
                continue;
            const payment = await stripefunctions.processStripePayment(accounts[i].stripeData.id, total);
            accounts[i].paymentHistory.push(payment);
            console.log('Payment successfully proccessed')
            const saved = await accounts[i].save();
            // TODO: Generate receipt
        }
    }
}

module.exports = { scheduleNewJob }