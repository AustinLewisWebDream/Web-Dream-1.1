const nodemailer = require('nodemailer');
const Hogan = require('hogan.js');
const fs = require('fs');

var template = fs.readFileSync('./EmailTemplates/receipt.hjs','utf-8');
var compiledTemplate = Hogan.compile(template);

const SENDER_ADDRESS = '"Austin" <austin@webdreamtech.com>'
const credentials = {
    username: 'austin@webdreamtech.com',
    password: '@Buttermilk1'
}

var transporter = nodemailer.createTransport({
    host: 'mail.webdreamtech.com',
    port: 587,
    secure: false,
    requireTLS: true,
    auth: {
        user: credentials.username,
        pass:  credentials.password
    }
});

const sendPasswordReset = async (email, token) => {
    var html = await String(token.token)
    html = '<h2>' + html + '</h2>'

    var mailOptions = {
        from: SENDER_ADDRESS,
        to: email,
        subject: 'Web Dream Password Reset',
        html,
    };
    send(mailOptions);
};

const sendReceipt = async (email, invoice) => {
    console.log('This is the current directory ', __dirname)


    const today = new Date();
    const day = today.getDate();
    const month = today.getMonth()+1;
    const year = today.getFullYear();
    const formattedDate = month + '-' + day + '-' + year

    var mailOptions = {
        from: '"Austin" <austin@webdreamtech.com>',
        to: email,
        subject: 'Web Dream Receipt',
        html: compiledTemplate.render({total: invoice.total, paidDate: formattedDate, invoiceNum: invoice.invoiceNumber, planName: invoice.name, price: invoice.total, total: invoice.total, subTotal: invoice.total, discount: 0 })
    };
    send(mailOptions);
};

const sendInvoiceCreated = async (email, invoice) => {
    console.log('This is the send invoice created function ', email, invoice)
    var html = '<p>'+ email +'</p>'
    html += '<p>'+ invoice.invoiceNumber +'</p>'
    html += '<p>'+ invoice.name +'</p>'
    html += '<p>'+ invoice.total +'</p>'
    html += '<p>'+ invoice.paid +'</p>'
    html += '<p>'+ invoice.dueDate +'</p>'
    var mailOptions = {
        from: '"Austin" <austin@webdreamtech.com>',
        to: email,
        subject: 'Web Dream Receipt',
        html
    };
    send(mailOptions);
}


const send = async (mailOptions) => {
    try {
        const sentMail = transporter.sendMail(mailOptions);
        console.log('Email sent to: ', mailOptions.to);
    } catch (error) {
        console.log('Error sending email to ', mailOptions.to, " Error: ", error)
    }

}

module.exports = { sendPasswordReset, sendReceipt, sendInvoiceCreated }