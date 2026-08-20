const express = require('express');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const cors = require('cors');
 
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
 
const app = express();
const PORT = process.env.PORT || 3000;
 
// সুনির্দিষ্ট CORS কনফিগারেশন (যা ব্রাউজার ও রেন্ডার কখনো ব্লক করবে না)
const corsOptions = {
  origin: [
    'https://faceboard-manna.vercel.app',  // আপনার লাইভ ফ্রন্টএন্ড
    'http://localhost:3000'                 // লোকাল ডেভেলপমেন্ট
  ],
  credentials: true
};
 
app.use(cors(corsOptions));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
 
// MongoDB URI এখন এনভায়রনমেন্ট ভেরিয়েবল থেকে নেবে (সুরক্ষিত থাকবে)
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
    const result = postsCollection ? await postsCollection.insertOne(newPost) : null;
    res.status(201).json({ success: true, insertedId: result?.insertedId, ...newPost });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});
 
// --- নতুন: পোস্ট ডিলিট করার route ---
app.delete('/api/posts/:id', async (req, res) => {
  try {
    if (!postsCollection) {
      return res.status(500).json({ success: false, error: "Database not connected" });
    }
    const result = await postsCollection.deleteOne({ _id: new ObjectId(req.params.id) });
    if (result.deletedCount === 1) {
      res.json({ success: true, message: 'Post deleted' });
    } else {
      res.status(404).json({ success: false, message: 'Post not found' });
    }
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
    const result = storiesCollection ? await storiesCollection.insertOne(newStory) : null;
    res.status(201).json({ success: true, insertedId: result?.insertedId, ...newStory });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});
 
app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});