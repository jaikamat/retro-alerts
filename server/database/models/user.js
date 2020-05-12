const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    firstname: {
        type: String,
        required: true
    },
    lastname: {
        type: String,
        required: true
    },
    email: String,
    phone: Number,
    contacted: {
        type: Date,
        default: null
    },
    wantlist: [{
        title: {
            type: String,
            required: true
        },
        itemId: {
            type: String,
            required: true
        },
        pending: Boolean
    }]
});


module.exports = mongoose.model('User', UserSchema);
