const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    email: String,
    phone: Number,
    wantlist: [{
        title: String,
        SKU: {
            type: String,
            required: true
        }
    }]
});


module.exports = mongoose.model('User', UserSchema);
