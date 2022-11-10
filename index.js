const express = require('express')
const jwt = require('jsonwebtoken');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const cors = require('cors')
require('dotenv').config();


const app = express()
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


// endpoints
app.get('/', (req, res) => {
    res.send('welcome to Moons-Law')
})

async function run() {
    try {

        // Collections 
        const servicesCollection = client.db('moonsLawDB').collection('services')
        const reviewsCollection = client.db('moonsLawDB').collection('reviews')

        app.post('/jwt', (req, res) => {
            const user = req.body;
            const token = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '7d' })
            res.send({ token })
        })

        // services API
        app.get('/services', async (req, res) => {
            const query = {}
            const cursor = servicesCollection.find(query);
            const result = await cursor.toArray();
            res.send(result);
        });

        app.get('/services/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) }
            const result = await servicesCollection.findOne(query);
            res.send(result);
        });

        app.post('/services', async (req, res) => {
            const service = req.body;
            const result = await servicesCollection.insertOne(service);
            res.send(result);
        });


        // reviews API
        app.get('/reviews/', async (req, res) => {

            let query = {}
            if (req.query.rmail) {
                query = {
                    rmail: req.query.rmail
                }
            }

            if (req.query.sid) {
                query = {
                    sid: req.query.sid
                }
            }

            const cursor = reviewsCollection.find(query);
            const result = await cursor.toArray();
            res.send(result);

        });

        app.get('/reviews/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await reviewsCollection.findOne(query);
            res.send(result);
        });

        app.post('/reviews', async (req, res) => {
            const review = req.body;
            const result = await reviewsCollection.insertOne(review);
            res.send(result);
        });

        app.patch('/reviews/:id', async (req, res) => {
            const id = req.params.id;
            const result = await reviewsCollection.updateOne({ _id: ObjectId(id) }, { $set: req.body });
            res.send(result);
        });

        app.delete('/reviews/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await reviewsCollection.deleteOne(query);
            res.send(result);
        });

    }

    finally {
    }
}
run().catch(error => console.error(error));


// status check
app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})