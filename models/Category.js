const {Schema, model, Types} = require('mongoose');

const schema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    image: {
        type: String,
        default: ''
    },
    user: {
        ref: 'User',
        type: Types.ObjectId,
        required: true
    }
});

module.exports = model('Category', schema);