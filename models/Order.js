const mongoose = require('mongoose');
const {Schema} = mongoose;

const schema = new Schema({
    date: {
        type: Date,
        default: Date.now
    },
    order: {
        type: Number,
        required: true
    },
    list: [
        {
            name: {
                type: String,
            },
            quantity: {
                type: Number,
            },
            cosr: {
                type: Number,
            }
        }
    ],
    user: {
        ref: 'users',
        type: Schema.Types.ObjectId,
        required: true
    }
});

module.exports = mongoose.model('orders', schema);