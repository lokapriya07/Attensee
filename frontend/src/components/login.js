import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './SignIn.css';

const SignIn = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/api/auth/login', {
        username,
        password,
      });
      // Navigate to the dashboard on successful login
      navigate('/dashboard', { state: { username } }); // Passing username as state
    } catch (err) {
      setError('Invalid username or password');
    }
  };

  return (
    <div className="signin-container">
      <div className="signin-card">
        <h2>Sign In</h2>
        {error && <p className="error-message">{error}</p>}
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Enter your username"
            aria-label="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Enter your password"
            aria-label="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit" className="signin-button">Sign In</button>
        </form>
      </div>
    </div>
  );
};

export default SignIn;
