const express = require('express');
const router = express.Router();
const User = require('../models/User');

// ১. নতুন ইউজার রেজিস্ট্রেশন API
router.post('/register', async (req, res) => {
  try {
    const newUser = new User(req.body);
    const savedUser = await newUser.save();
    res.status(200).json(savedUser);
  } catch (err) {
    res.status(500).json(err);
  }
});

// ২. ইউজার লগইন API
router.post('/login', async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) return res.status(404).json("ইউজার পাওয়া যায়নি!");

    if (user.password !== req.body.password) {
      return res.status(400).json("ভুল পাসওয়ার্ড!");
    }

    res.status(200).json(user);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;