# CodeAlpha Task 3 - Project Management Tool

Collaborative Trello/Asana-style full-stack application.

## Core features
- Authentication with JWT and bcrypt
- Group project creation
- Add project members
- Project boards with To Do, In Progress and Done
- Task cards, assignment, priority and due date
- Change task status and delete tasks
- Comments inside tasks
- User search
- MongoDB/Mongoose backend
- Responsive HTML/CSS/JavaScript frontend

## Setup
```powershell
npm.cmd install
```
Create `.env` from `.env.example`:
```env
PORT=5002
MONGODB_URI=mongodb://127.0.0.1:27017/codealpha_project_management
JWT_SECRET=change_this_to_a_long_random_secret
```
Then:
```powershell
npm.cmd run seed
npm.cmd run dev
```
Open http://localhost:5002

Demo login: `demo@example.com` / `Password123`

Notifications and WebSocket real-time updates are bonus features and are not required for the core task.
