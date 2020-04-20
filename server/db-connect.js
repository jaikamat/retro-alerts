require('dotenv').config();
const mongoose = require('mongoose');

async function connect() {
    try {
        await mongoose.connect(`${process.env.MONGO_URI}`, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            retryWrites: true, // MongoDB Atlas parameter
            w: 'majority' // MongoDB Atlas parameter
        });
        console.log('Mongo connection established');
    } catch (e) {
        console.log('Mongo connection failed')
        console.log(e.message);
    }
}

module.exports = connect();