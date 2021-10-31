const express = require('express');
const { MongoClient } = require('mongodb');
const app = express();
var cors = require('cors');
const port = process.env.PORT || 5000;
const bodyParser = require("body-parser");
const ObjectId = require('mongodb').ObjectId; 

require('dotenv').config();

app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.send('Hello World!');
});

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.tqbro.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });


async function run(){
    try{
        await client.connect();
        const database = client.db("travelGoDb");
        const packagesCollection = database.collection("packages");
        const emailCollection = database.collection("bookBYEmail");

        // POST packages
        app.post('/addPackages', async (req,res)=>{
            const result = await packagesCollection.insertOne(req.body);
            res.send(result);
        });
        // get packages to server
        app.get('/addPackages', async (req,res)=>{
            const result = await packagesCollection.find({}).toArray();
            res.json(result);
        });
        // get individual package
        app.get('/addPackages/:id', async (req,res)=>{
            const query = { _id: ObjectId(req.params.id) }
            const package = await packagesCollection.findOne(query);
            res.send(package);
        });
        // insert orders in db
        app.post('/myOrders', async(req,res)=>{
            const result = await emailCollection.insertOne(req.body);
            res.send(result);
        });
        app.get('/myOrders', async (req,res)=>{
            const result = await emailCollection.find({}).toArray();
            res.json(result);
        });
        // delete orders
        app.delete('/myOrders/:id', async(req,res)=>{
            const query = {_id: ObjectId(req.params.id)};
            const result = await emailCollection.deleteOne(query);
            res.json(result);
        });
        // update status
        app.put('/myOrders/:id', async(req,res)=>{
            const query = {_id: ObjectId(req.params.id)};
            const updateDoc = {
                $set : {
                    status: "approved"
                },
            };
            const result = await emailCollection.updateOne(query,updateDoc);
            res.send(result);
        })
    }
    finally{
        // await
    }
}

run().catch(console.dir);



app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
});