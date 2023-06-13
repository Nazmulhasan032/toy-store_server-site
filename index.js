const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config()
const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());


app.get('/', (req, res) => {
  res.send('Toy store server is running');
})


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.5dmbeep.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    const toyCollection = client.db('ToyCar').collection('store');


    app.get('/allToys', async (req, res) => {
      const cursor = toyCollection.find().limit(20);
      const result = await cursor.toArray();
      res.send(result);
    })

    app.get('/allToys/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await toyCollection.findOne(query)
      res.send(result);

    })


    app.get('/myToys/:email', async (req, res) => {
      const email = req.params.email;
      console.log(email);
      const result = await toyCollection.find({ email: req.params.email }).toArray();
      res.send(result);
    });



    app.post('/allToys', async (req, res) => {
      const postedData = req.body;
      const result = await toyCollection.insertOne(postedData);
      res.send(result);
    })




    app.put('/updateToy/:id', async (req, res) => {
      try {
        const id = req.params.id;
        const body = req.body;
        const filter = { _id: new ObjectId(id) };
        const updateDoc = {
          $set: {
            name: body.name,
            toyName: body.toyName,
            category: body.category,
            price: body.price,
            picture: body.picture,
            quantity: body.quantity,
            description: body.description,
          },
        };
        const result = await toyCollection.updateOne(filter, updateDoc);
        res.json({ modifiedCount: result.modifiedCount });
      } catch (error) {
        console.log('Error:', error);
        res.status(500).json({ error: 'An error occurred' });
      }
    });




    app.delete('/allToys/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await toyCollection.deleteOne(query);
      res.send(result);

    })





    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    
  }
}
run().catch(console.dir);





app.listen(port, () => {
  console.log(`server is running on port: ${port}`);

})