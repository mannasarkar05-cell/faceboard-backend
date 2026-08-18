const express = require('express');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const cors = require('cors');

// SSL সিকিউরিটি বাইপাস ও এনভায়রনমেন্ট সেটআপ
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

const app = express();
const PORT = process.env.PORT || 5000;

// মিডলওয়্যার
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// MongoDB কানেকশন ইউআরআই
const uri = "mongodb+srv://mannasarkar05_db_user:dACXZPaF9yYTZZIU@cluster0.owkxryp.mongodb.net/?appName=Cluster0";

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

// ডাটাবেস এবং কালেকশন ডিক্লেয়ারেশন
let db, postsCollection, storiesCollection;

async function run() {
  try {
    await client.connect();
    db = client.db("faceboardDB");
    postsCollection = db.collection("posts");
    storiesCollection = db.collection("stories");
    
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } catch (error) {
    console.error("Connection failed:", error);
  }
}
run().catch(console.dir);

// রুট রাউট
app.get('/', (req, res) => {
  res.send('FaceBoard Server is running with Database!');
});

// ১. সকল পোস্ট পাওয়ার জন্য GET রিকোয়েস্ট
app.get('/api/posts', async (req, res) => {
  try {
    const posts = await postsCollection.find({}).toArray();
    res.json(posts);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// ২. নতুন পোস্ট সেভ করার জন্য POST রিকোয়েস্ট
app.post('/api/posts', async (req, res) => {
  try {
    const newPost = {
      ...req.body,
      createdAt: new Date()
    };
    const result = await postsCollection.insertOne(newPost);
    res.status(201).json({ success: true, insertedId: result.insertedId, ...newPost });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// ৩. পোস্ট ডিলিট করার জন্য DELETE রিকোয়েস্ট
app.delete('/api/posts/:id', async (req, res) => {
  try {
    const id = req.params.id;
    // আইডি যদি ObjectId ফরম্যাটে না হয়ে সাধারণ নাম্বার বা স্ট্রিং হয়, তবে কন্ডিশন পরিবর্তন করা লাগতে পারে
    const query = ObjectId.isValid(id) ? { _id: new ObjectId(id) } : { id: Number(id) || id };
    const result = await postsCollection.deleteOne(query);
    
    if (result.deletedCount > 0) {
      res.json({ success: true, message: 'Post deleted successfully' });
    } else {
      res.status(404).json({ success: false, message: 'Post not found' });
    }
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// ৪. স্টোরি ফেচ করার GET রিকোয়েস্ট
app.get('/api/stories', async (req, res) => {
  try {
    const stories = await storiesCollection.find({}).toArray();
    res.json(stories);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// ৫. নতুন স্টোরি যোগ করার POST রিকোয়েস্ট
app.post('/api/stories', async (req, res) => {
  try {
    const newStory = {
      ...req.body,
      createdAt: new Date()
    };
    const result = await storiesCollection.insertOne(newStory);
    res.status(201).json({ success: true, insertedId: result.insertedId, ...newStory });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// সার্ভার চালু করার কোড (Render-এর ডায়নামিক পোর্টের জন্য `process.env.PORT` সহ)
app.listen(PORT, () => {
  console.log(`🚀 Backend server is running on port ${PORT}`);
});