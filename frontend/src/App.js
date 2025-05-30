// Importing core React library
import React from 'react';

// Importing routing components from react-router-dom
import { Routes, Route } from 'react-router-dom';

// Importing custom components for different pages
import Home from './components/Home';
import EditorPage from './components/EditorPage';
import Login from './components/Login';
import Register from './components/Register';
import PrivateRoute from './components/PrivateRoute'; // Wrapper component to protect routes

// Importing Toaster for showing toast notifications
import { Toaster } from 'react-hot-toast';

// Main App component
function App() {
  return (
    <>
      {/* Toaster notification component positioned at the top center of the screen */}
      <Toaster position="top-center" />

      {/* Defining application routes */}
      <Routes>

        {/* Public Routes */}
        <Route path="/login" element={<Login />} />     {/* Login page */}
        <Route path="/register" element={<Register />} /> {/* Registration page */}

        {/* Protected Routes (accessible only if authenticated) */}
        
        {/* Home page route wrapped in PrivateRoute to ensure it's accessible only by authenticated users */}
        <Route
          path="/"
          element={
            <PrivateRoute>
              <Home />
            </PrivateRoute>
          }
        />

        {/* Editor page route with dynamic roomId parameter, also protected by PrivateRoute */}
        <Route
          path="/editor/:roomId"
          element={
            <PrivateRoute>
              <EditorPage />
            </PrivateRoute>
          }
        />
      </Routes>
    </>
  );
}

export default App;
