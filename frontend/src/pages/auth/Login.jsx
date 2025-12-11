import React, { useState } from 'react';
import axios from '../../services/api';
import { setAuthToken } from '../../services/api';
import { Link, useNavigate } from 'react-router-dom';

const API_URL = 'http://localhost:8000/api/users';

export default function Login() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    code: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState('');
  const [showActivate, setShowActivate] = useState(false);
  const [activationLoading, setActivationLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccessMsg('');
    setShowActivate(false);
    try {
      // JWT login
      const response = await axios.post(`${API_URL}/token/`, {
        username: formData.email,
        password: formData.password
      });
      const { access, refresh } = response.data;
      // Store tokens (localStorage for demo)
      localStorage.setItem('accessToken', access);
      localStorage.setItem('refreshToken', refresh);
      setAuthToken(access);
      
      // Try to access admin endpoint to check admin status
      try {
        const userRes = await axios.get('http://localhost:8000/api/admin/users/', {
          headers: {
            'Authorization': `Bearer ${access}`
          }
        });
        // If request succeeds, user is admin - redirect to admin dashboard
        setSuccessMsg('Login successful! Redirecting to admin dashboard...');
        setTimeout(() => {
          navigate('/admin');
        }, 800);
      } catch (fetchErr) {
        // If forbidden (403), user is not admin
        if (fetchErr.response && fetchErr.response.status === 403) {
          setError('You are not an admin. Only admin users can access the dashboard.');
          // Clear tokens if not admin
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
          setAuthToken(null);
        } 
        // If backend is not available or network error, still redirect (for development)
        else if (!fetchErr.response || fetchErr.code === 'ERR_NETWORK' || fetchErr.code === 'ECONNREFUSED') {
          console.warn('Backend not available, but login succeeded. Redirecting to admin dashboard...');
          setSuccessMsg('Login successful! Redirecting...');
          setTimeout(() => {
            navigate('/admin');
          }, 800);
        }
        // Other errors (like 401, 500, etc) - still redirect and let dashboard handle it
        else {
          console.warn('Admin check failed, but redirecting anyway:', fetchErr.response?.status);
          setSuccessMsg('Login successful! Redirecting...');
          setTimeout(() => {
            navigate('/admin');
          }, 800);
        }
      }
    } catch (err) {
      if (err.response?.data?.detail === 'No active account found with the given credentials') {
        setError('Invalid credentials.');
      } else if (err.response?.data?.error === 'Account not activated.') {
        setShowActivate(true);
        setError('Your account is not active. Please enter the code sent to your email to activate.');
      } else {
        setError(err.response?.data?.error || 'Login failed. Check your credentials.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleResendCode = async () => {
    setActivationLoading(true);
    setError(null);
    setSuccessMsg('');
    try {
      await axios.post(`${API_URL}/register/`, { email: formData.email });
      setSuccessMsg('Activation code resent to your email.');
    } catch (err) {
      setError('Failed to resend activation code.');
    } finally {
      setActivationLoading(false);
    }
  };

  const handleActivate = async (e) => {
    e.preventDefault();
    setActivationLoading(true);
    setError(null);
    setSuccessMsg('');
    try {
      await axios.post(`${API_URL}/verify/`, {
        email: formData.email,
        code: formData.code
      });
      setSuccessMsg('Account activated! You can now log in.');
      setShowActivate(false);
    } catch (err) {
      setError('Invalid code. Please try again.');
    } finally {
      setActivationLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 animate-fade-in bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="max-w-md w-full">
        <div className="card animate-fade-in shadow-2xl border-0">
          <div className="mb-6 text-right">
            <Link to="/register" className="text-blue-600 hover:text-blue-700 font-semibold transition-colors">
              Create Account →
            </Link>
          </div>
          
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl mb-4 shadow-lg">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h2 className="text-3xl font-bold text-gradient mb-2">Welcome Back</h2>
            <p className="text-gray-600">Sign in to your account</p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-lg animate-fade-in">
              <div className="flex items-center">
                <svg className="w-5 h-5 text-red-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                <p className="text-red-700 text-sm font-medium">{error}</p>
              </div>
            </div>
          )}
          
          {successMsg && (
            <div className="mb-6 p-4 bg-green-50 border-l-4 border-green-500 rounded-lg animate-fade-in">
              <div className="flex items-center">
                <svg className="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <p className="text-green-700 text-sm font-medium">{successMsg}</p>
              </div>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                  </svg>
                </div>
                <input
                  name="email"
                  type="email"
                  placeholder="you@example.com"
                  className="input-field pl-10"
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <input
                  name="password"
                  type="password"
                  placeholder="••••••••"
                  className="input-field pl-10"
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full btn-primary ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Logging in...
                </span>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <span className="text-gray-600">Don't have an account? </span>
            <Link to="/register" className="text-blue-600 hover:text-blue-700 font-semibold transition-colors">
              Register
            </Link>
          </div>

          {showActivate && (
            <div className="mt-8 pt-8 border-t border-gray-200 animate-fade-in">
              <div className="text-center mb-4">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-yellow-100 rounded-full mb-2">
                  <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
                <p className="text-sm text-gray-600">Enter the activation code sent to your email</p>
              </div>
              
              <form onSubmit={handleActivate} className="space-y-4">
                <input
                  name="code"
                  type="text"
                  placeholder="000000"
                  maxLength={6}
                  className="w-full px-4 py-4 border-2 border-gray-300 rounded-lg text-center text-3xl tracking-[0.5em] font-bold focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  onChange={handleChange}
                  required
                />
                <button
                  type="submit"
                  disabled={activationLoading}
                  className={`w-full py-3 px-4 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl ${activationLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  {activationLoading ? 'Activating...' : 'Activate Account'}
                </button>
              </form>
              
              <button
                type="button"
                onClick={handleResendCode}
                disabled={activationLoading}
                className="w-full mt-3 text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors disabled:opacity-50"
              >
                {activationLoading ? 'Resending...' : 'Resend Activation Code'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
