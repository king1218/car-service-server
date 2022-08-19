const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();
//middle ware:
app.use(cors());
app.use(express.json());



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.rahsr.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
async function run() {
    try {
        await client.connect();
        const serviceCollection = client.db('car-service').collection('services');
        const orderCollection = client.db('car-service').collection('order');
        app.get('/service', async (req, res) => {
            const query = {};
            const cursor = serviceCollection.find(query);
            const services = await cursor.toArray();
            res.send(services);
        })
        app.get('/service/:id', async (req,res)=>{
            const id=req.params.id;
            const query = {_id:ObjectId(id)};
            const service = await serviceCollection.findOne(query);
            res.send(service);

        })
        app.post('/addService', async (req,res)=>{
               const newService = req.body;
               const result = await serviceCollection.insertOne(newService);
               res.send(result);
        })
        app.delete('/service/:id', async (req,res)=>{
            const id=req.params.id;
            const query = {_id:ObjectId(id)};
            const service = await serviceCollection.deleteOne(query);
            res.send(service);
        })
        app.post('/order',async (req,res)=>{
            const newOrder = req.body;
            const result = await orderCollection.insertOne(newOrder);
            res.send(result);
        })
        app.get('/orders', async (req,res)=>{
            const email = req.query.email;
            const query = {email:email};
            const cursor = orderCollection.find(query);
            const orders = await cursor.toArray();
            res.send(orders);
        })

    }
    finally {

    }
}
run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('Running Car Server!');
});
app.listen(port, () => {
    console.log('Lissening car service');
})