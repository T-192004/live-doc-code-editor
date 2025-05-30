# 🖥️ CodeCast - Collaborative Code Editor (Frontend)

**CodeCast** is a real-time collaborative code editor built with **React.js** and **Socket.IO**. Users can create or join a room, write JavaScript code together, and see each other's changes live in real-time.

---

## 🚀 Features

- 🔐 Create or join a coding room using a unique Room ID
- 👨‍💻 Real-time code collaboration using WebSockets (Socket.IO)
- 🧠 Syntax highlighting and formatting via CodeMirror
- 🎨 Dracula theme for modern UI aesthetics
- 📋 Copy Room ID & leave room functionality
- 👥 Dynamic user avatars powered by `react-avatar`
- 🔔 Toast notifications for user join/leave and actions using `react-hot-toast`

---

## 💠 Tech Stack

- **Frontend:** React.js (Vite / CRA)
- **Real-time Communication:** Socket.IO Client
- **Editor:** CodeMirror (JavaScript mode, Dracula theme)
- **Notifications:** react-hot-toast
- **Avatars:** react-avatar
- **Routing:** react-router-dom

---

## 📁 Folder Structure
    
    ├── public/
    │ └── images/
    │ └── codecast.png # Logo
    ├── src/
    │ ├── components/
    │ │ ├── Home.js # Home page to join/create rooms
    │ │ ├── EditorPage.js # Room-based editor page
    │ │ ├── Editor.js # CodeMirror integration
    │ │ └── Client.js # Avatar and user component
    │ ├── Socket.js # Socket.IO connection manager
    │ ├── App.js # React Router config
    │ └── index.js # Entry point
    └── README.md

---

## ⚙️ Getting Started

### 1. Clone the Repository
    
    git clone https://github.com/your-username/codecast-frontend.git
    cd codecast-frontend


### 2. Install Dependencies

    npm install
    # or
    yarn install


### 3. Configure Environment Variables
Create a .env file in the root directory:


    REACT_APP_BACKEND_URL=https://live-doc-code-editor.onrender.com

Replace with your actual backend deployment URL if hosted remotely.

### 4. Start the App

    npm start

Open your browser and navigate to:
👉 http://localhost:3000

## ✅ How to Use
- Launch the frontend app.

- Enter a username and an existing Room ID to join a session.

- Or click Create New Room to generate a new unique room ID.

- Share the Room ID with collaborators.

Enjoy real-time collaborative coding!


## 📤 Deployment
You can deploy the frontend using platforms like Netlify, Vercel, or GitHub Pages.

⚠️ Make sure to set your environment variable REACT_APP_BACKEND_URL to your deployed backend API.

Example with Vercel:
    vercel login
    vercel

## 🛠️ Contributing
Pull Requests are welcome! Here's how:

### Fork the repo

    Create a new branch: git checkout -b feature/your-feature-name

    Commit your changes

    Push to your branch: git push origin feature/your-feature-name

    Open a Pull Request

## 📸 Preview
Add screenshots or screen recordings here to show the live collaboration in action.

Example:

## 📃 License
This project is licensed under the MIT License.

## 👩‍💻 Author
Tanvi Tomar
🔗 GitHub
📧 tomartanvi89@example.com


---

If you want me to insert your Tanvi Tomar, GitHub handle, deployment instructions, or a working preview URL
