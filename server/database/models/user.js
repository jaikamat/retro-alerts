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
    wantlist: [{
        title: String,
        itemId: {
            type: String,
            required: true
        }
    }]
});


module.exports = mongoose.model('User', UserSchema);
