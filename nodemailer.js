const nodemailer = require('nodemailer');


var transporter = nodemailer.createTransport({
    host: 'mail.webdreamtech.com',
    port: 587,
    secure: false,
    requireTLS: true,
    auth: {
        user: 'austin@webdreamtech.com', // your domain email address
        pass: '@Buttermilk1' // your password
    }
  });
  
  var mailOptions = {
    from: '"Bob" <austin@webdreamtech.com>',
    to: 'opticsillusion@live.com',
    subject: "Hello",
    html: "Here goes the message body"
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