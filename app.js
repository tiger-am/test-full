const express = require('express');

const analyticsRouter = require('./routes/analytics');
const authRouter = require('./routes/auth');
const categoryRouter = require('./routes/category');
const orderRouter = require('./routes/order');
const positionRouter = require('./routes/position');

const app = express();
const PORT = process.env.PORT || 5000;

app.use('/api/analitics', analyticsRouter);
app.use('/api/auth', authRouter);
app.use('/api/category', categoryRouter);
app.use('/api/order', orderRouter);
app.use('/api/position', positionRouter);


// app.use('/', express.static(__dirname + '/views'));

app.listen(PORT, () => console.log(`Server is started on port:${PORT}`));
