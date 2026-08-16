const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const PORT = 5000;

// মিডলওয়্যার
app.use(cors());
app.use(bodyParser.json());

// সাময়িকভাবে ডেটা সংরক্ষণের জন্য মেমোরি অ্যারে (পরে এখানে ডাটাবেজ যুক্ত করতে পারবেন)
let posts = [
  {
    id: 1,
    name: 'Wears Zone',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&q=80',
    time: '2 hours ago',
    content: 'Welcome to our new social media platform!',
    mediaUrl: '',
    mediaType: '',
    feeling: '😀 Happy',
    likes: 5,
    isLiked: false,
    comments: ['Chandana: Nice platform!']
  }
];

// ১. সকল পোস্ট পাওয়ার জন্য GET রিকোয়েস্ট
app.get('/api/posts', (req, res) => {
  res.json(posts);
});

// ২. নতুন পোস্ট সেভ করার জন্য POST রিকোয়েস্ট
app.post('/api/posts', (req, res) => {
  const newPost = {
    id: Date.now(),
    ...req.body
  };
  posts.unshift(newPost); // নতুন পোস্ট সবার উপরে যুক্ত হবে
  res.status(201).json(newPost);
});

app.listen(PORT, () => {
  console.log(`Backend server is running on http://localhost:${PORT}`);
});