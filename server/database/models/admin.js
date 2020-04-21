const mongoose = require('mongoose');

const AdminSchema = mongoose.Schema({
    username: String,
    password: String,
    email: String
})

module.exports.AdminModel = mongoose.model('Admin', AdminSchema);
module.exports.AdminSchema = AdminSchema; // Using this Schema in the createUser script, need to export it