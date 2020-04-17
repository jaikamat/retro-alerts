require('dotenv').config();
const mongoose = require('mongoose');

const uri = process.env.MONGO_URI;
const collection = 'retro_alert';

async function connect() {
    try {
        await mongoose.connect(`${uri}/${collection}`, { useNewUrlParser: true, useUnifiedTopology: true });
        console.log('Mongo connection established');
    } catch (e) {
        console.log('Mongo connection failed')
        console.log(e.message);
    }
}

module.exports = connect();