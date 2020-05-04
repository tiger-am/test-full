const mongoose = require('mongoose');
const {Schema} = mongoose;

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
        ref: 'categories',
        type: Schema.Types.ObjectId,
        required: true
    },
    user: {
        ref: 'users',
        type: Schema.Types.ObjectId,
        required: true
    }
});

module.exports = mongoose.model('positions', schema);