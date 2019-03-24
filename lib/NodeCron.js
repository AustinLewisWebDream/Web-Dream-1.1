// const schedule = require('node-schedule');
// const shortid = require('shortid');
// const stripefunctions = require('../lib/StripeFunctions');
// const mailer = require('./MailFunctions');

// const mongoose = require('mongoose');

// var User = mongoose.model('User');

// const DAYS_AWAY_FROM_DUE = 7;

// const scheduleAccountAuditing = async () => {
//     var auditingSchedule = schedule.scheduleJob( ('*/30 * * * *'), async function() {
//         const accounts = await User.find({});
//         reviewAccounts(accounts);
//     });
// }

// const scheduleInvoiceGeneration = async () => {
//     var now = new Date();
//     var currentDate = new Date(now.getFullYear(), now.getMonth()+1, now.getDate())

//     // Run this process every hour on the 45th minute
//     var invoiceGenerationSchedule = schedule.scheduleJob('45 * * * *', async function() {
//         const accounts = await User.find({});
//         await generateInvoices(accounts);
//         await processPayments(accounts);
//     });
// }

// const reviewAccounts = (accountsList) => {
//     for(var i = 0; i < accounts.length; i++) {
//         const account = accounts[i]
//         for(var j = 0; j < accounts[i].subscriptions.length; j++) {
//             const invoices = account.invoices[i];
//             // If the invoice is not paid and it is 15 days past the due date, suspend user services
//                 // Email notify the user that they must pay their invoice
//             // Else Ignore the invoice
//         }   
//     }
// }

// const generateInvoices = async(accounts) => {
//     var now = new Date();
//     const thisMonth = now.getMonth();
//     const nextMonth = new Date(now.getFullYear(), now.getMonth()+1, now.getDate() + DAYS_AWAY_FROM_DUE)
//     const numDaysAway = now.getDate() + DAYS_AWAY_FROM_DUE;

//     for(var i = 0; i < accounts.length; i++) {
//         var services = [];
//         var total = 0;
//         for(var j = 0; j < accounts[i].subscriptions.length; j++) {
//             const subscription = accounts[i].subscriptions[j].subscription;
//             if(accounts[i].subscriptions[j].renewDate.getMonth() == thisMonth && accounts[i].subscriptions[j].renewDate.getDate() == numDaysAway ) {
//                 total += subscription.monthly;
//                 services.push({
//                     name: accounts[i].subscriptions[j].subscription.name,
//                     price: accounts[i].subscriptions[j].subscription.monthly,
//                     dueDate: accounts[i].subscriptions[j].renewDate
//                 })
//                 accounts[i].subscriptions[j].renewDate = nextMonth;
//                 accounts[i].markModified('subscriptions')
//                 const saved = await accounts[i].save();
//             }
//         }   
//         if(services.length) {
//             const newInvoice = {
//                 invoiceNumber: shortid.generate(),
//                 name: accounts[i].email,
//                 services: services,
//                 total: total,
//                 paid: false,
//                 dueDate: nextMonth
//             }
//             mailer.sendInvoiceCreated(accounts[i].email, newInvoice);
//             accounts[i].invoices.push(newInvoice);
//             const saved = await accounts[i].save();
//         }
//     }
// }


// // TODO: Handle if user's payment does not process with stripe
// const processPayments = async (accounts) => {
    
//     var today = new Date();
//     const currentMonth = today.getMonth();
//     const currentDay = today.getDate();

//     // Iterate accounts
//     for(var i = 0; i < accounts.length; i++) {
//         // If auto renew is off, skip the account
//         if(!accounts[i].autoRenew)
//             continue;
    
//         // Iterate invoices
//         for(var j = 0; j < accounts[i].invoices.length; j++) {
//             // If Invoice has been paid, skip the invoice
//             if(accounts[i].invoices[j].paid) {
//                 continue;
//             }

//             // If the invoice is due today, then proccess the payment for that invoice
//             const dueDate = accounts[i].invoices[j].dueDate;
//             if(dueDate.getDate() == currentDay && dueDate.getMonth() == currentMonth) {
//                 const payment = await stripefunctions.processStripePayment(accounts[i].stripeData.id, accounts[i].invoices[j].total);
//                 accounts[i].paymentHistory.push(payment);
//                 accounts[i].invoices[j].paid = true;
//                 accounts[i].markModified('invoices');
//                 mailer.sendReceipt(accounts[i].email, accounts[i].invoices[j]);
//                 const saved = await accounts[i].save();
//             }
//         }
//     }
// }

// module.exports = { scheduleAccountAuditing, scheduleInvoiceGeneration }