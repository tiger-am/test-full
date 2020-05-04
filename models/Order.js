const {Schema, model, Types} = require('mongoose');

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
            cost: {
                type: Number,
            }
        }
    ],
    user: {
        ref: 'User',
        type: Types.ObjectId,
        required: true
    }
});

module.exports = model('Order', schema);