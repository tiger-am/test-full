require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const passport = require('passport');
const path = require('path');
const analyticsRouter = require('./routes/analytics');
const authRouter = require('./routes/auth');
const categoryRouter = require('./routes/category');
const orderRouter = require('./routes/order');
const positionRouter = require('./routes/position');

const app = express();
const PORT = process.env.PORT || 5000;

const {
    // MONGO_USERNAME,
    // MONGO_PASSWORD,
    MONGO_PORT,
    MONGO_HOSTNAME,
    MONGO_DB
} = process.env;

// const url = `mongodb://${MONGO_USERNAME}:${MONGO_PASSWORD}@${MONGO_HOSTNAME}:${MONGO_PORT}/${MONGO_DB}`;
const url = `mongodb://${MONGO_HOSTNAME}:${MONGO_PORT}/${MONGO_DB}`;

const options = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
};

mongoose.connect(url, options)
    .then(() => console.log('DB CONNECTED'))
    .catch(e => console.log(e.message));

app.use(passport.initialize());
require('./middleware/passport')(passport);

app.use(require('morgan')('dev'));
app.use('/uploads', express.static('uploads'));
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(require('cors')());

app.use('/api/analytics', analyticsRouter);
app.use('/api/auth', authRouter);
app.use('/api/category', categoryRouter);
app.use('/api/order', orderRouter);
app.use('/api/position', positionRouter);

if(process.env.NODE_ENV === 'production') {
    app.use(express.static(__dirname + '/client/dist/client'));

    app.get('*', (req, res)=> {
        res.sendFile(
            path.resolve(
                __dirname, 'client', 'dist', 'client', 'index.html'
            )
        )
    })
}

app.listen(PORT, () => console.log(`Server running on port:${PORT}`));
