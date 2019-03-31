// Configurations
const port = 5000;

const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const passport = require('passport');
const config = require('./db/db');
const cors = require('cors');
const app = express();
const jobs = require('./lib/NodeCron');



// // MongoDB Error logging
mongoose.connect(config.DB, { useNewUrlParser: true }).then(
  () => {console.log('Database is connected') },
  err => { console.log('Cannot connect to the database'+ err)}
);



// Required to communicate from font-end to back-end
var corsOptions = {
  origin: 'http://localhost:3000',
  optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}
app.options('*', cors());



// Routes
const users       = require('./routes/user'); 
const quotes      = require('./routes/quote');
const admin       = require('./routes/admin');
const privateUser = require('./routes/protectedUser');


// const plans = require('./hostingPlans');

// Initialize passport
app.use(passport.initialize());
require('./passport')(passport);

// Initialize Body-parser
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Automatically processes invoices and payments on a schedule
//jobs.scheduleInvoiceGeneration();

// Static image serving for emails
app.use('/api/static/images', express.static('public/images'))

// Route to access the API
app.use('/api/users', users);
app.use('/api/quote', quotes);
app.use('/api/admin', admin);
app.use('/api/user', privateUser);

app.listen(port, () => `Server running on port ${port}`);