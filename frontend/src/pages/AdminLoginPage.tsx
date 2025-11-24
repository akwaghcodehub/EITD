import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import Input from '../components/common/Input';
import Button from '../components/common/Button';
import Card from '../components/common/Card';

const AdminLoginPage: React.FC = () => {
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      await login(formData.email, formData.password);
      
      // Check if user is admin
      const user = useAuthStore.getState().user;
      if (user?.role !== 'admin') {
        setError('Access denied. Admin credentials required.');
        useAuthStore.getState().logout();
        setIsLoading(false);
        return;
      }
      
      navigate('/admin');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <h2 className="text-4xl font-bold text-illini-blue">Admin Portal</h2>
          <p className="mt-2 text-gray-600">Sign in with admin credentials</p>
        </div>

        <Card>
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <Input
              label="Admin Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="admin@illinois.edu"
            />

            <Input
              label="Admin Password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              required
              placeholder="••••••••"
            />

            <Button type="submit" variant="primary" isLoading={isLoading} className="w-full">
              Sign In as Admin
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-600">
              Not an admin?{' '}
              <Link to="/login" className="text-illini-orange font-semibold hover:underline">
                Regular Login
              </Link>
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default AdminLoginPage;