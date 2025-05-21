import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { login } from '../services/authService';
import { useAuth } from '../hooks/useAuth'; // Assuming useAuth hook exists for accessing user data

const Login = () => {
  const { user } = useAuth(); // Retrieve user from auth hook
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(formData);
      navigate('/');
    } catch (err) {
      setError('Invalid email or password');
    }
  };

  return (
    <div className="container mt-5" style={{ maxWidth: '500px' }}>
      <h2 className="mb-4 fw-bold text-center">Login</h2>
      {error && <div className="alert alert-danger">{error}</div>}
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="email" className="form-label">Email address</label>
          <input
            type="email"
            name="email"
            id="email"
            value={formData.email}
            onChange={handleChange}
            className="form-control"
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="password" className="form-label">Password</label>
          <input
            type="password"
            name="password"
            id="password"
            value={formData.password}
            onChange={handleChange}
            className="form-control"
            required
          />
        </div>
        <button type="submit" className="btn btn-primary w-100">
          Login
        </button>
      </form>
      <div className="text-center mt-3">
        Don't have an account?{' '}
        <Link to="/register" className="text-decoration-none">
          Register
        </Link>
      </div>

      {/* Conditional render for Add Payroll button */}
      {user && user.isAdmin && (
        <div className="text-center mt-3">
          <Link to="/payrolls/new">
            <button classTransportationName="btn btn-secondary">Add Payroll</button>
          </Link>
        </div>
      )}
    </div>
  );
};

export default Login;
