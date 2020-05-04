const {Schema, model, Types} = require('mongoose');

const schema = new Schema({
    name: {
        type: String,
        required: true
    },
    cost: {
        type: Number,
        required: true
    },
    category: {
        ref: 'Category',
        type: Types.ObjectId,
        required: true
    },
    user: {
        ref: 'User',
        type: Types.ObjectId,
        required: true
    }
});

module.exports = model('Position', schema);