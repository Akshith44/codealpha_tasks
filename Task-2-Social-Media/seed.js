require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const Post = require('./models/Post');

async function seed() {
  await mongoose.connect(process.env.MONGODB_URI);
  await Promise.all([User.deleteMany({}), Post.deleteMany({})]);
  const password = await bcrypt.hash('Password123', 10);
  const users = await User.create([
    { name: 'Demo User', username: 'demo', email: 'demo@example.com', password, bio: 'Welcome to CodeAlpha Social!' },
    { name: 'CodeAlpha Student', username: 'student', email: 'student@example.com', password, bio: 'Full Stack Development learner.' },
    { name: 'Web Developer', username: 'developer', email: 'developer@example.com', password, bio: 'Building web projects.' }
  ]);
  users[0].following.push(users[1]._id); users[1].followers.push(users[0]._id);
  await users[0].save(); await users[1].save();
  await Post.create([
    { user: users[0]._id, text: 'Hello everyone! Welcome to my first post on CodeAlpha Social.' },
    { user: users[1]._id, text: 'Learning Node.js, Express and MongoDB today. 🚀' },
    { user: users[2]._id, text: 'Building projects is a great way to practice full-stack development.' }
  ]);
  console.log('Seed complete. Demo login: demo@example.com / Password123');
  await mongoose.disconnect();
}
seed().catch(err => { console.error(err); process.exit(1); });
