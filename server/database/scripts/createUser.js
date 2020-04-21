require('dotenv').config();
const argv = require('yargs').argv; // elegantly parses process.argv
const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const { AdminSchema } = require('../models/admin');

/**
 * Outputs a cryptographically hashed password string suitable for persistence
 * 
 * @param {String} password
 */
function createPasswordHash(password) {
    const saltRounds = 10;
    const salt = bcrypt.genSaltSync(saltRounds);
    return bcrypt.hashSync(password, salt);
}

/**
 * Touches the database and persists an initial admin user
 * 
 * @param {String} username
 * @param {String} password
 */
async function createUser(username, password) {
    try {
        await mongoose.connect(`${process.env.MONGO_URI}`, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            retryWrites: true, // MongoDB Atlas parameter
            w: 'majority' // MongoDB Atlas parameter
        });

        const AdminModel = mongoose.connection.model('Admin', AdminSchema);

        const newAdmin = new AdminModel({
            username: username,
            password: createPasswordHash(password),
            email: 'testing@mctesterson.com'
        });

        await newAdmin.save();
    } catch (err) {
        throw err;
    } finally {
        await mongoose.connection.close();
    }
}

async function init() {
    const { username, password } = argv;

    if (!username || !password) {
        throw new Error('Username and password required');
    }
    if (password.length < 8) {
        throw new Error('Password is too short (min 8 chars)');
    }
    try {
        await createUser(username, password);
        console.log(`${username} was created`)
    } catch (err) {
        throw err;
    }
}

init().catch(err => console.log(err.message));