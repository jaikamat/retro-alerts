require('dotenv').config();
const axios = require('axios');

async function refreshLightspeedAuthToken() {
    try {
        const { data } = await axios.post(process.env.LIGHTSPEED_TOKEN, {
            grant_type: process.env.GRANT_TYPE,
            client_id: process.env.CLIENT_ID,
            client_secret: process.env.CLIENT_SECRET,
            refresh_token: process.env.REFRESH_TOKEN
        });

        return data.access_token;
    } catch (e) {
        throw e;
    }
}

module.exports = { refreshLightspeedAuthToken };