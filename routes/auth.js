const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// ১. নতুন ইউজার রেজিস্ট্রেশন API (পাসওয়ার্ড এনক্রিপশন সহ)
router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // চেক করা ইউজার আগে থেকেই আছে কিনা
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json("এই ইমেইল দিয়ে ইতিমধ্যে অ্যাকাউন্ট আছে!");
    }

    // পাসওয়ার্ড হ্যাশ বা এনক্রিপ্ট করা
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      name,
      email,
      password: hashedPassword
    });

    const savedUser = await newUser.save();
    
    // সিকিউরিটির জন্য রেসপন্সে পাসওয়ার্ড হাইড করে পাঠানো ভালো
    const { password: _, ...userWithoutPassword } = savedUser._doc;
    res.status(200).json(userWithoutPassword);
  } catch (err) {
    res.status(500).json(err);
  }
});

// ২. ইউজার লগইন API (এনক্রিপ্টেড পাসওয়ার্ড ম্যাচিং ও JWT টোকেন সহ)
router.post('/login', async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) return res.status(404).json("ইউজার পাওয়া যায়নি!");

    // bcrypt দিয়ে পাসওয়ার্ড চেক করা
    const validPassword = await bcrypt.compare(req.body.password, user.password);
    if (!validPassword) {
      return res.status(400).json("ভুল পাসওয়ার্ড!");
    }

    // JWT টোকেন জেনারেট করা
    const token = jwt.sign(
      { id: user._id },
      'mysecretkey123', // আপনি চাইলে এটি .env ফাইলে রাখতে পারেন
      { expiresIn: '7d' }
    );

    // পাসওয়ার্ড বাদে ইউজার ডাটা এবং টোকেন পাঠানো
    const { password: _, ...userWithoutPassword } = user._doc;
    res.status(200).json({ ...userWithoutPassword, token });
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;