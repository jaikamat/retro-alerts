const axios = require('axios');

async function getItemPage(token, offset) {
    try {
        const { data } = await axios.get(`${process.env.LS_ENDPOINT}/Item.json`, {
            params: { offset, load_relations: `["ItemShops"]` }, // ItemShops is the qoh
            headers: { Authorization: `Bearer ${token}` }
        });

        return {
            inventory: data.Item,
            count: data['@attributes'].count,
            limit: data['@attributes'].limit
        };
    } catch (e) {
        throw e;
    }
}

module.exports = { getItemPage };