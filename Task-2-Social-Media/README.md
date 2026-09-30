# CodeAlpha Task 2 - Social Media Platform

Full-stack social media platform built for the CodeAlpha Full Stack Development internship task.

## Features
- User registration and login with JWT authentication
- Password hashing with bcrypt
- User profiles and bio
- Search users
- Follow/unfollow users
- Create posts with optional image URL
- Like/unlike posts
- Comments
- Delete own posts
- MongoDB database with Mongoose
- Responsive HTML/CSS/JavaScript frontend

## Tech Stack
HTML, CSS, JavaScript, Node.js, Express.js, MongoDB, Mongoose, JWT, bcryptjs.

## Run locally
1. Install Node.js LTS.
2. Create a MongoDB Atlas cluster (or use a local MongoDB server).
3. Copy `.env.example` to `.env` and add your MongoDB URI and JWT secret.
4. In this folder run:
   `npm install`
5. Optional demo data:
   `npm run seed`
6. Start:
   `npm run dev`
7. Open `http://localhost:5001`.

Demo account after seeding: `demo@example.com` / `Password123`.

## GitHub
Do not commit `.env` or `node_modules`. Push the project inside your `codealpha_tasks` repository, preferably as `Task-2-Social-Media`.
