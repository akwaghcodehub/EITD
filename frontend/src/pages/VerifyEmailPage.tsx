import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import Button from '../components/common/Button';
import Card from '../components/common/Card';

const VerifyEmailPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState<'verifying' | 'success' | 'error'>('verifying');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const token = searchParams.get('token');

    if (!token) {
      setStatus('error');
      setMessage('Invalid verification link. No token provided.');
      return;
    }

    // ✅ ADD DELAY to prevent flash of error
    const timer = setTimeout(() => {
      verifyEmail(token);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchParams]);

  const verifyEmail = async (token: string) => {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/auth/verify-email/${token}`
      );
      setStatus('success');
      setMessage(response.data.message);
      
      // ✅ Auto redirect to login after 3 seconds
      setTimeout(() => {
        navigate('/login');
      }, 3000);
    } catch (error: any) {
      setStatus('error');
      setMessage(error.response?.data?.message || 'Verification failed. Link may be invalid or expired.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <h2 className="text-4xl font-bold text-illini-blue">
            Email Verification
          </h2>
        </div>

        <Card>
          {status === 'verifying' && (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-illini-orange mx-auto mb-4"></div>
              <p className="text-gray-600 text-lg">Verifying your email...</p>
              <p className="text-gray-500 text-sm mt-2">Please wait a moment</p>
            </div>
          )}

          {status === 'success' && (
            <div className="text-center py-8">
              <div className="mb-4">
                <svg
                  className="w-20 h-20 text-green-500 mx-auto"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="text-3xl font-bold text-green-600 mb-3">
                Success!
              </h3>
              <p className="text-gray-600 text-lg mb-2">{message}</p>
              <p className="text-gray-500 text-sm mb-6">
                Redirecting to login in 3 seconds...
              </p>
              <Button
                variant="primary"
                onClick={() => navigate('/login')}
                className="w-full"
              >
                Go to Login Now
              </Button>
            </div>
          )}

          {status === 'error' && (
            <div className="text-center py-8">
              <div className="mb-4">
                <svg
                  className="w-20 h-20 text-red-500 mx-auto"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="text-3xl font-bold text-red-600 mb-3">
                Verification Failed
              </h3>
              <p className="text-gray-600 mb-6">{message}</p>
              <div className="space-y-3">
                <Button
                  variant="primary"
                  onClick={() => navigate('/register')}
                  className="w-full"
                >
                  Back to Registration
                </Button>
                <Button
                  variant="outline"
                  onClick={() => navigate('/login')}
                  className="w-full"
                >
                  Try Login Anyway
                </Button>
              </div>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

export default VerifyEmailPage;