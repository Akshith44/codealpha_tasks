const express = require('express');
const User = require('../models/User');
const Post = require('../models/Post');
const auth = require('../middleware/auth');

const router = express.Router();

function userData(u) {
  return { id: u._id, name: u.name, username: u.username, bio: u.bio, avatar: u.avatar,
    followersCount: u.followers.length, followingCount: u.following.length };
}

router.get('/search', auth, async (req, res) => {
  try {
    const q = (req.query.q || '').trim();
    if (!q) return res.json([]);
    const users = await User.find({ $or: [
      { username: { $regex: q, $options: 'i' } },
      { name: { $regex: q, $options: 'i' } }
    ] }).limit(20);
    res.json(users.map(userData));
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.get('/:username', auth, async (req, res) => {
  try {
    const user = await User.findOne({ username: req.params.username.toLowerCase() });
    if (!user) return res.status(404).json({ message: 'User not found' });
    const posts = await Post.find({ user: user._id }).populate('user', 'name username avatar').sort({ createdAt: -1 });
    res.json({ user: userData(user), isFollowing: user.followers.some(id => id.toString() === req.user.id), posts });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.post('/:id/follow', auth, async (req, res) => {
  try {
    if (req.params.id === req.user.id) return res.status(400).json({ message: 'You cannot follow yourself' });
    const target = await User.findById(req.params.id);
    const me = await User.findById(req.user.id);
    if (!target) return res.status(404).json({ message: 'User not found' });
    const already = target.followers.some(id => id.toString() === me.id);
    if (already) {
      target.followers.pull(me._id); me.following.pull(target._id);
    } else {
      target.followers.addToSet(me._id); me.following.addToSet(target._id);
    }
    await Promise.all([target.save(), me.save()]);
    res.json({ following: !already, followersCount: target.followers.length });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.put('/me', auth, async (req, res) => {
  try {
    const { name, bio, avatar } = req.body;
    const user = await User.findByIdAndUpdate(req.user.id, { name, bio, avatar }, { new: true, runValidators: true });
    res.json(userData(user));
  } catch (err) { res.status(500).json({ message: err.message }); }
});

module.exports = router;
