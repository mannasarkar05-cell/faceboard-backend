const express = require('express');
const router = express.Router();
const Post = require('../models/Post');

// ১. নতুন পোস্ট তৈরি করার API
router.post('/', async (req, res) => {
  try {
    const newPost = new Post(req.body);
    const savedPost = await newPost.save();
    res.status(200).json(savedPost);
  } catch (err) {
    res.status(500).json(err);
  }
});

// ২. সব পোস্ট একসাথে দেখার API
router.get('/all', async (req, res) => {
  try {
    const posts = await Post.find().sort({ createdAt: -1 });
    res.status(200).json(posts);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;