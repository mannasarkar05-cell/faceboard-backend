const express = require('express');

const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

const cors = require('cors');



process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";



const app = express();

const PORT = process.env.PORT || 3000;



app.use(cors({

app.use(express.json({ limit: '50mb' }));

app.use(express.urlencoded({ limit: '50mb', extended: true }));



const uri = "mongodb+srv://mannasarkar05_db_user:Db982798@cluster0.owkxryp.mongodb.net/?appName=Cluster0";



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



let db, postsCollection, storiesCollection;



async function run() {

  try {

    await client.connect();

    db = client.db("faceboardDB");

    postsCollection = db.collection("posts");

    storiesCollection = db.collection("stories");

    console.log("Connected to MongoDB!");

  } catch (error) {

    console.error("MongoDB Connection Error:", error);

  }

}

run();



app.get('/', (req, res) => {

  res.send('FaceBoard Server is running with Database!');

});



app.get('/api/posts', async (req, res) => {

  try {

    const posts = postsCollection ? await postsCollection.find({}).toArray() : [];

    res.json(posts);

  } catch (error) {

    res.status(500).json({ success: false, error: error.message });

  }

});



app.post('/api/posts', async (req, res) => {

  try {

    const newPost = { ...req.body, createdAt: new Date() };

    const result = await postsCollection.insertOne(newPost);

    res.status(201).json({ success: true, insertedId: result.insertedId, ...newPost });

  } catch (error) {

    res.status(500).json({ success: false, error: error.message });

  }

});



app.get('/api/stories', async (req, res) => {

  try {

    const stories = storiesCollection ? await storiesCollection.find({}).toArray() : [];

    res.json(stories);

  } catch (error) {

    res.status(500).json({ success: false, error: error.message });

  }

});



app.post('/api/stories', async (req, res) => {

  try {

    const newStory = { ...req.body, createdAt: new Date() };

    const result = await storiesCollection.insertOne(newStory);

    res.status(201).json({ success: true, insertedId: result.insertedId, ...newStory });

  } catch (error) {

    res.status(500).json({ success: false, error: error.message });

  }

});



app.listen(PORT, "0.0.0.0", () => {

  console.log(`🚀 Server is running on port ${PORT}`);

});