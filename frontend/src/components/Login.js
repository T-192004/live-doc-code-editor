import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';

function Login() {
  // State hooks to manage user input
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  // Handle user login
  const handleLogin = async (e) => {
    e.preventDefault();

    // Basic input validation
    if (!username || !password) {
      toast.error('All fields are required');
      return;
    }

    try {
      // Send login request to backend API
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          identity: username, // accepts either username or email
          password: password
        })
      });

      const data = await response.json();

      if (!response.ok) {
        // Handle invalid credentials or backend errors
        toast.error(data.msg || 'Login failed');
        return;
      }

      // Store authentication data in localStorage
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      localStorage.setItem('username', data.user.username); // optional

      toast.success('Login successful');

      // Redirect to home page or dashboard
      navigate('/');
    } catch (error) {
      console.error("Login error:", error);
      toast.error('Something went wrong. Please try again.');
    }
  };

  return (
    <div className="container-fluid">
      <div className="row justify-content-center align-items-center min-vh-100">
        <div className="col-12 col-md-4">
          <div className="card shadow-sm p-4 mb-5 bg-secondary rounded">
            <div className="card-body text-center bg-dark">
              {/* App Logo */}
              <img
                className="img-fluid mx-auto d-block"
                src="/images/reatime-do-editor.png"
                alt="logo"
                style={{ maxWidth: '150px' }}
              />

              {/* Page Heading */}
              <h3 className="text-light mb-4">User Login</h3>

              {/* Username or Email Field */}
              <div className="mb-3">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Enter your Username or Email"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>

              {/* Password Field */}
              <div className="mb-3">
                <input
                  type="password"
                  className="form-control"
                  placeholder="Enter your Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              {/* Login Button */}
              <button
                className="btn btn-success btn-lg btn-block w-100 mt-2"
                onClick={handleLogin}
              >
                LOGIN
              </button>

              {/* Redirect to Register */}
              <p className="mt-3 text-light">
                Don't have an account?{' '}
                <span
                  className="text-success"
                  style={{ cursor: 'pointer' }}
                  onClick={() => navigate('/register')}
                >
                  Register Now
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
