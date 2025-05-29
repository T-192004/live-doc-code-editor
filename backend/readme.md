# 🧠 Real-Time Collaborative Code Editor - Backend

This is the backend API for a **Real-Time Collaborative Code Editor**, built using **Node.js**, **Express.js**, **MongoDB (Mongoose)**, and **JWT-based Authentication**.

## LIVE URL - 
    https://live-docs-editor.onrender.com

## 📂 Project Structure

    backend
    ├── models/ # Mongoose Schemas
    │ ├── User.js
    │ ├── Room.js
    │ └── Document.js
    ├── routes/ # API Route Handlers
    │ └── auth.js
    ├── middleware/ # Custom middleware (e.g., auth)
    │ └── auth.js
    ├── config/
    │ └── db.js # MongoDB connection and model bindings
    ├── .env # Environment variables
    └── server.js # Entry point of the server

---

## 🚀 Getting Started

### 📦 Prerequisites

- Node.js (v14 or later)
- MongoDB Atlas or local MongoDB instance

### 🔧 Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/T-192004/live-docs-editor
   cd backend

2. **Install dependencies**

    npm install

3. **Setup environment variables**
Create a .env file in the root and add:

    JWT_SECRET=your_jwt_secret_key
    PORT=5000

4. **Run the server**

    npm start
    Server will start on http://localhost:5000

## 🧑‍💻 API Endpoints

### ✅ Auth
**POST /api/auth/register**
- Registers a new user.

- Request body:

    {
    "username": "tanvi",
    "email": "tanvi@example.com",
    "password": "secret123"
    }

**POST /api/auth/login**
- Logs in a user using either email or username.

- Request body:

    {
    "identity": "tanvi",
    "password": "secret123"
    }


## 🧾 MongoDB Schemas
- 👤 User
username, email, password (hashed)

- 🏠 Room
name, roomId, createdBy, participants

- 📄 Document
roomId, content, createdBy, lastEditedBy

- 🔒 Middleware
    authMiddleware: Verifies JWT token and attaches user info to req.user.
    adminMiddleware (optional): Checks if user has admin privileges.

## 📌 Features
- Secure JWT Authentication

- Password hashing with bcrypt

- MongoDB connection using Mongoose

- Basic CRUD-ready schema setup for real-time collaboration features


## 📚 Future Enhancements
- Socket.IO for real-time code sync

- Rich-text or code editor integration

- Role-based access (admin, editor, viewer)

- Versioning or document history


## 🤝 License
MIT License

## ✨ Author
Tanvi Tomar
Student | Web Developer | Intern at CodTech


Let me know if you'd like me to generate a `package.json`, `.env.example`, or `OpenAPI` documentation too!






