const express = require('express');
const authRouter = require('./routes/auth')
const app = express();


app.use('/api/auth', authRouter);
// app.use('/', express.static(__dirname + '/views'));

module.exports = app;
