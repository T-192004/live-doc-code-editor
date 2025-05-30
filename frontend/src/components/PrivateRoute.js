// components/PrivateRoute.js

import React from 'react';
import { Navigate } from 'react-router-dom';

/**
 * PrivateRoute component
 * This component protects routes that require authentication.
 * If the user is authenticated, it renders the children (protected component).
 * Otherwise, it redirects the user to the login page.
 *
 * @param {Object} props - React props
 * @param {JSX.Element} props.children - The component to render if authenticated
 */
function PrivateRoute({ children }) {
  // Retrieve token or authentication flag from localStorage
  const isAuthenticated = localStorage.getItem('token');

  // If authenticated, render the child component, otherwise redirect to login
  return isAuthenticated ? children : <Navigate to="/login" />;
}

export default PrivateRoute;
