const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const router = express.Router();

function tokenFor(user) {
  return jwt.sign({ id: user._id, username: user.username }, process.env.JWT_SECRET, { expiresIn: '7d' });
}

function publicUser(user) {
  return { id: user._id, name: user.name, username: user.username, email: user.email, bio: user.bio, avatar: user.avatar,
    followersCount: user.followers.length, followingCount: user.following.length };
}

router.post('/register', async (req, res) => {
  try {
    const { name, username, email, password } = req.body;
    if (!name || !username || !email || !password) return res.status(400).json({ message: 'All fields are required' });
    if (password.length < 6) return res.status(400).json({ message: 'Password must be at least 6 characters' });
    const exists = await User.findOne({ $or: [{ email: email.toLowerCase() }, { username: username.toLowerCase() }] });
    if (exists) return res.status(409).json({ message: 'Email or username already exists' });
    const hash = await bcrypt.hash(password, 10);
    const user = await User.create({ name, username: username.toLowerCase(), email: email.toLowerCase(), password: hash });
    res.status(201).json({ token: tokenFor(user), user: publicUser(user) });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email: (email || '').toLowerCase() });
    if (!user || !(await bcrypt.compare(password || '', user.password))) return res.status(401).json({ message: 'Invalid email or password' });
    res.json({ token: tokenFor(user), user: publicUser(user) });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

module.exports = router;
