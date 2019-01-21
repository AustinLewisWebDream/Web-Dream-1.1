// Configurations
const port = 5000;


const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const passport = require('passport');
const config = require('./db/db');
const stripe = require('stripe')('sk_test_fgs0ulkn4MDVYTm3DtQPZs2M');
const cors = require('cors');
const encryption = require('./encryption');
const nodemailer = require('nodemailer');
const app = express();

// Routes
const users       = require('./routes/user'); 
const quotes      = require('./routes/quote');
const admin       = require('./routes/admin');
const privateUser = require('./routes/protectedUser');

// MongoDB Error logging
mongoose.connect(config.DB, { useNewUrlParser: true }).then(
  () => {console.log('Database is connected') },
  err => { console.log('Cannot connect to the database'+ err)}
);

// Required to communicate from font-end to back-end
app.use(cors());

// Initialize passport
app.use(passport.initialize());
require('./passport')(passport);

// Initialize Body-parser
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Static image serving for emails
app.use('/api/static/images', express.static('public/images'))

// Route to access the API
app.use('/api/users', users);
app.use('/api/quote', quotes);
app.use('/api/admin', admin);
app.use('/api/user', privateUser);

app.listen(port, () => `Server running on port ${port}`);