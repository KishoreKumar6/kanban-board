🧭 Kanban TaskBoard 

Deployment URL: https://kanbanboard-five-zeta.vercel.app/

Github Backend Code: https://github.com/KishoreKumar6/kanbanboard/tree/main/kanban-server

A sleek and responsive task management dashboard built with React, Express, and MongoDB, featuring drag-and-drop organization, persistent dark mode, editable task columns, and secure JWT-based authentication.
🚀 Features
🎯 Drag-and-drop task cards across customizable columns

🌙 Light / Dark mode toggle with persistence

🔐 Authenticated access via JWT (Login required)

✏️ Edit & delete columns with cascading task updates

📋 Task details: title, description, assignee, due date, label, priority

🔍 Real-time search by task title

🧱 Modular structure using React components

🍃 RESTful backend with MongoDB + Mongoose

🧱 Tech Stack
ReactJS	Node.js	MongoDB
TailwindCSS	Express.js	Mongoose
React DnD	JWT Auth	
React Toastify	REST API	

📦 Setup Instructions
🔧 Backend
Clone the repo and navigate to /kanban-server

Run npm install

Add a .env file:

PORT=5000
MONGO_URI=<your_mongo_connection_string>
JWT_SECRET=<your_jwt_secret>
Run with node server.js

🌐 Frontend
Navigate to /kanban-board

Run npm install

Start with npm run dev (or npm start if configured)

📁 Folder Structure
bash
kanban-board: pages - Dashboard, Login, Register, AddTask, Column, EditTask, Home, TaskCard 


kanban-server: models - Column, Task, User.. routes - authRoutes, ColunRoutes, task.. Server.js

🛡️ Authentication
User login stored in localStorage via JWT

Protected dashboard routes using token check

Automatically redirects to login on invalid token

🗃️ API Endpoints
Columns
GET /api/columns

POST /api/columns

PUT /api/columns/:oldName

DELETE /api/columns/:name

Tasks
GET /api/tasks

POST /api/tasks

PUT /api/tasks/:id

DELETE /api/tasks/:id

💡 Customization Ideas
✅ Add user roles and team assignments

📊 Add statistics or analytics sidebar

🔄 Add auto-refresh or polling

📅 Calendar or timeline view

📝 License
MIT — Feel free to use and modify.
