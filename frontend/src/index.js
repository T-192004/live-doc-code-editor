// Importing core React libraries
import React from 'react';
import ReactDOM from 'react-dom/client';

// Importing global styles
import './index.css';

// Importing the main App component
import App from './App';

// Importing BrowserRouter to enable client-side routing
import { BrowserRouter } from 'react-router-dom';

// Importing performance measuring function
import reportWebVitals from './reportWebVitals';

// Importing Bootstrap CSS for styling
import "bootstrap/dist/css/bootstrap.min.css";

// Creating a root element for rendering the React app into the DOM
const root = ReactDOM.createRoot(document.getElementById('root'));

// Rendering the app component wrapped with React.StrictMode and BrowserRouter
root.render(
  <React.StrictMode> {/* Helps identify potential problems in the application during development */}
    <BrowserRouter>    {/* Enables routing throughout the app */}
      <App />          {/* Main application component */}
    </BrowserRouter>
  </React.StrictMode>
);

// To measure performance metrics in the app, pass a callback to log or send data
// Example: reportWebVitals(console.log) or send to an analytics endpoint
// Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
