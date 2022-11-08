const express = require('express')
const { MongoClient, ServerApiVersion } = require('mongodb');
const app = express()
const cors = require('cors')
require('dotenv').config();
const port = process.env.PORT || 5000


// middleware
app.use(cors())
app.use(express.json())


// DB Connection 
const uri = process.env.MONGO_DB_URI;

const client = new MongoClient(uri);

async function dbConnect() {
    try {
        await client.connect();
        // console.log("Database connected");
    } catch (error) {
        console.log(error.name);
    }
}
dbConnect();

// Collections 
const servicesCollection = client.db('moonsLawDB').collection('services')

// endpoints
app.get('/', (req, res) => {
    res.send('welcome to Moons-Law')
})

async function run() {
    try {

        // services 

        app.get('/services', async (req, res) => {
            const query = {}
            const cursor = servicesCollection.find(query);
            const result = await cursor.toArray();
            res.send(result);
        });

        app.get('/services/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await servicesCollection.findOne(query);
            res.send(result);
        });

        app.post('/services', async (req, res) => {
            const service = req.body;
            console.log(service)
            const result = await servicesCollection.insertOne(service);
            res.send(result);
        });

    }

    finally {

    }

}

run().catch(err => console.error(err));





// status check
app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})