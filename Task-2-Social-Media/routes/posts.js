const express = require('express');
const Post = require('../models/Post');
const auth = require('../middleware/auth');

const router = express.Router();

const populatePost = q => q.populate('user', 'name username avatar').populate('comments.user', 'name username avatar');

router.get('/', auth, async (req, res) => {
  try {
    const posts = await populatePost(Post.find()).sort({ createdAt: -1 }).limit(50);
    res.json(posts);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.post('/', auth, async (req, res) => {
  try {
    const { text, image } = req.body;
    if (!text || !text.trim()) return res.status(400).json({ message: 'Post text is required' });
    const post = await Post.create({ user: req.user.id, text: text.trim(), image: image || '' });
    const result = await populatePost(Post.findById(post._id));
    res.status(201).json(result);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.delete('/:id', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });
    if (post.user.toString() !== req.user.id) return res.status(403).json({ message: 'You can delete only your own posts' });
    await post.deleteOne();
    res.json({ message: 'Post deleted' });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.post('/:id/like', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });
    const index = post.likes.findIndex(id => id.toString() === req.user.id);
    if (index >= 0) post.likes.splice(index, 1); else post.likes.push(req.user.id);
    await post.save();
    res.json({ liked: index < 0, likesCount: post.likes.length });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.post('/:id/comments', auth, async (req, res) => {
  try {
    const text = (req.body.text || '').trim();
    if (!text) return res.status(400).json({ message: 'Comment cannot be empty' });
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });
    post.comments.push({ user: req.user.id, text });
    await post.save();
    const result = await populatePost(Post.findById(post._id));
    res.json(result);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

module.exports = router;
