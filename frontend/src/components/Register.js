import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';

function Register() {
  // State variables for form fields
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Hook to navigate programmatically
  const navigate = useNavigate();

  // Handle registration form submission
  const handleRegister = async (e) => {
    e.preventDefault();

    // Validate required fields
    if (!username || !email || !password) {
      toast.error('All fields are required');
      return;
    }

    try {
      // Send POST request to backend for registration
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, email, password }),
      });

      const data = await response.json();

      // Handle server-side errors
      if (!response.ok) {
        throw new Error(data.message || 'Registration failed');
      }

      // Show success message and navigate to login page
      toast.success('Registration successful');
      navigate('/login');
    } catch (error) {
      // Handle any other errors
      toast.error(error.message || 'Something went wrong');
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

              {/* Form Heading */}
              <h3 className="text-light mb-4">Register New User</h3>

              {/* Username Input */}
              <div className="mb-3">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Enter your Username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>

              {/* Email Input */}
              <div className="mb-3">
                <input
                  type="email"
                  className="form-control"
                  placeholder="Enter your Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              {/* Password Input */}
              <div className="mb-3">
                <input
                  type="password"
                  className="form-control"
                  placeholder="Enter your Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              {/* Register Button */}
              <button
                className="btn btn-success btn-lg btn-block w-100 mt-2"
                onClick={handleRegister}
              >
                REGISTER
              </button>

              {/* Navigation Link to Login */}
              <p className="mt-3 text-light">
                Already have an account?{' '}
                <span
                  className="text-success"
                  style={{ cursor: 'pointer' }}
                  onClick={() => navigate('/login')}
                >
                  Login Now
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;
