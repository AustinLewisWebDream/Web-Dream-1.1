const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

var User = mongoose.model('users');


module.exports = router;