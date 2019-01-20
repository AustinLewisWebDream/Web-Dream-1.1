const nodemailer = require('nodemailer');


var transporter = nodemailer.createTransport({
    host: 'mail.webdreamtech.com',
    port: 587,
    secure: false,
    requireTLS: true,
    auth: {
        user: 'austin@webdreamtech.com', 
        pass: '@Buttermilk1' 
    }
});

const sendPasswordReset = async (email, token) => {
    const subject = 'Web Dream Password Reset'
    var html = await String(token.token)
    html = '<h2>' + html + '</h2>'

    var mailOptions = {
        from: '"Austin" <austin@webdreamtech.com>',
        to: 'atle223@g.uky.edu',
        subject,
        html
    };
    transporter.sendMail(mailOptions, function (err, info) {
        if (err) {
            console.log(err);
            return ('Error while sending email' + err)
        } else {
            console.log("Email sent");
            return ('Email sent')
        }
    });
};


module.exports = { sendPasswordReset }