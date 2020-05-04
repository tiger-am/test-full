const mongoose = require('mongoose');
const {Schema} = mongoose;

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
        ref: 'users',
        type: Schema.Types.ObjectId,
        required: true
    }
});

module.exports = mongoose.model('categories', schema);