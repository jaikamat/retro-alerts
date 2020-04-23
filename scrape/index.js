require('dotenv').config();
const MongoClient = require('mongodb').MongoClient;
const { scrapeInventory } = require('./scrapeInventory');
const DATABASE = 'retro_alert';
const COLLECTION = 'scraped_inventory';
const BATCH_SIZE = 1000;

async function init() {
    const client = new MongoClient(process.env.MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    });

    try {
        await client.connect();

        console.log('Mongo client connected!');

        try {
            await client.db(DATABASE).dropCollection(COLLECTION); // Drop the collection before re-writing it 
            console.log(`Collection ${COLLECTION} dropped`);
        } catch (err) {
            await client.db(DATABASE).createCollection(COLLECTION); // Collection was not dropped, create it
            console.log(`Collection ${COLLECTION} created`);
        }

        const db = client.db(DATABASE).collection(COLLECTION);

        await db.createIndex({ systemSku: 1 });
        await db.createIndex({ upc: 1 });
        console.log(`Index on systemSku and upc created!`);

        const scrapedData = await scrapeInventory();

        const scrapedDataModified = scrapedData.map(d => {
            const { systemSku, description, customSku, manufacturerSku, upc, Prices, ItemShops } = d;
            return { systemSku, description, customSku, manufacturerSku, upc, Prices, ItemShops };
        })

        const bulkWriteOps = scrapedDataModified.map(d => {
            return { insertOne: { document: d } };
        })

        while (bulkWriteOps.length > 0) {
            const ops = bulkWriteOps.splice(0, BATCH_SIZE);
            await db.bulkWrite(ops);
        }

        console.log(`${scrapedData.length} bulk items written to database`);
    } catch (err) {
        console.log(err);
    } finally {
        await client.close();
        console.log('Mongo client closed');
    }
}

init();