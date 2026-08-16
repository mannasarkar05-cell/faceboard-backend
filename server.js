const express = require('express');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const cors = require('cors');

process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

const app = express();
app.use(cors());
app.use(express.json());

const uri = process.env.MONGODB_URI;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
  tls: true,
  tlsAllowInvalidCertificates: true,
  family: 4
});

async function run() {
  try {
    await client.connect();
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } catch (error) {
    console.error("Connection failed:", error);
  }
}
run().catch(console.dir);

const db = client.db("faceboardDB");
const postsCollection = db.collection("posts");

app.post('/add-post', async (req, res) => {
  try {
    const newPost = req.body;
    const result = await postsCollection.insertOne(newPost);
    res.send({ success: result.acknowledged, message: "Post added successfully!", result });
  } catch (error) {
    res.status(500).send({ success: false, error: error.message });
  }
});

app.get('/posts', async (req, res) => {
  try {
    const query = {};
    const cursor = postsCollection.find(query);
    const posts = await cursor.toArray();
    res.send(posts);
  } catch (error) {
    res.status(500).send({ success: false, error: error.message });
  }
});

app.put('/posts/react/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const filter = { _id: new ObjectId(id) };
    const updateDoc = {
      $inc: { likes: 1 }
    };
    const result = await postsCollection.updateOne(filter, updateDoc);
    res.send({ success: true, message: "Reaction updated!", result });
  } catch (error) {
    res.status(500).send({ success: false, error: error.message });
  }
});

app.get('/', (req, res) => {
  res.send('FaceBoard Server is running with Database!');
});

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`🚀 Server is running on port ${port}!`);
});