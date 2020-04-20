require('dotenv').config();
const fs = require('fs');
const _ = require('lodash');
const Bottleneck = require('bottleneck');
const { getItemPage } = require('./fetch-inventory');
const { refreshLightspeedAuthToken } = require('./lightspeed-token');

module.exports.scrapeInventory = async function () {
    try {
        console.time('processTime'); // Log process time

        const limiter = new Bottleneck({ maxConcurrent: 1, minTime: 1000 });

        // Set up one retry if a task fails
        limiter.on('failed', async (err, jobInfo) => {
            const id = jobInfo.options.id;
            console.warn(`Job ${id} failed: ${err.message}`)

            if (jobInfo.retryCount === 0) { // Check the number of retries tracked to the job
                console.log(`Retrying job ${id} in 1 second`);
                return 1000; // ms to wait before retrying - respect the rate limiting here
            }
        });

        limiter.on('done', (info) => {
            console.log(limiter.counts());
        });

        const auth_token = await refreshLightspeedAuthToken(); // Retrieve the access token for Lightspeed

        const { count, limit } = await getItemPage(auth_token, 0); // Fetch initial inventory size and limits

        const numPages = Math.ceil(count / limit); // Determine total number of inventory "pages"

        const offsetPages = _.range(0, numPages).map(p => p * 100); // Create an array of offsets

        const throttledGetItemPage = limiter.wrap(getItemPage); // Throttle the getItemPage function

        const mappedTasks = offsetPages.map(c => throttledGetItemPage(auth_token, c));

        const data = await Promise.all(mappedTasks);

        const results = _.flatten(data.map(d => d.inventory));

        fs.writeFileSync(`./data/inventory_${new Date().toISOString()}.json`, JSON.stringify(results));

        console.timeEnd('processTime'); // Log process time

        return results;
    } catch (e) {
        console.log(e);
    }
}