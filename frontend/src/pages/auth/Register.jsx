import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

// Assuming you have an API base URL config, or define it here
const API_URL = 'http://localhost:8000/api/users'; 

export default function Register() {
  const [step, setStep] = useState(1); // 1 = Details, 2 = Verification
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    first_name: '',
    last_name: '',
    code: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Step 1: Register User & Trigger Email
  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await axios.post(`${API_URL}/register/`, {
        email: formData.email,
        password: formData.password,
        first_name: formData.first_name,
        last_name: formData.last_name
      });
      
      setSuccessMsg(response.data.message);
      setStep(2); // Move to code entry
    } catch (err) {
      console.error('Registration error:', err);
      
      // Network error - backend not running
      if (!err.response) {
        setError('Cannot connect to server. Please make sure the backend is running on http://localhost:8000');
        return;
      }
      
      // Handle different error types
      const errorData = err.response.data;
      
      // Email already exists
      if (errorData?.error?.includes('already exists') ||
          errorData?.email?.[0]?.includes('already exists') ||
          (typeof errorData === 'string' && errorData.includes('already exists'))) {
        setError('This email is already used. Please use a different email.');
      }
      // Validation errors
      else if (errorData?.email) {
        setError(Array.isArray(errorData.email) ? errorData.email[0] : errorData.email);
      }
      else if (errorData?.password) {
        setError(Array.isArray(errorData.password) ? errorData.password[0] : errorData.password);
      }
      else if (errorData?.first_name) {
        setError(Array.isArray(errorData.first_name) ? errorData.first_name[0] : errorData.first_name);
      }
      else if (errorData?.last_name) {
        setError(Array.isArray(errorData.last_name) ? errorData.last_name[0] : errorData.last_name);
      }
      // Generic error message
      else if (errorData?.error) {
        setError(errorData.error);
      }
      // Non-field errors
      else if (errorData && typeof errorData === 'object') {
        const firstError = Object.values(errorData)[0];
        setError(Array.isArray(firstError) ? firstError[0] : firstError);
      }
      else {
        setError(err.response?.status === 500 
          ? 'Server error. Please try again later.' 
          : 'Registration failed. Please check your details and try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Verify Code
  const handleVerify = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await axios.post(`${API_URL}/verify/`, {
        email: formData.email,
        code: formData.code
      });
      
      setSuccessMsg("Verification Successful! Redirecting to login...");
      
      // Redirect after 2 seconds
      setTimeout(() => {
        window.location.href = '/login';
      }, 2000);
      
    } catch (err) {
      setError(err.response?.data?.error || "Invalid code. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 animate-fade-in bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="max-w-md w-full">
        <div className="card animate-fade-in shadow-2xl border-0">
          <div className="mb-6 text-right">
            <Link to="/login" className="text-blue-600 hover:text-blue-700 font-semibold transition-colors">
              Login →
            </Link>
          </div>
          
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl mb-4 shadow-lg">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
              </svg>
            </div>
            <h2 className="text-3xl font-bold text-gradient mb-2">
              {step === 1 ? 'Create Account' : 'Verify Email'}
            </h2>
            <p className="text-gray-600">
              {step === 1 ? 'Join us and get started' : 'Check your inbox for the code'}
            </p>
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

          {step === 1 ? (
            <form onSubmit={handleRegister} className="space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">First Name</label>
                  <input
                    name="first_name"
                    type="text"
                    placeholder="John"
                    className="input-field"
                    onChange={handleChange}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
                  <input
                    name="last_name"
                    type="text"
                    placeholder="Doe"
                    className="input-field"
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
              
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
                    placeholder="Minimum 8 characters"
                    className="input-field pl-10"
                    onChange={handleChange}
                    required
                    minLength={8}
                  />
                </div>
                <p className="mt-1 text-xs text-gray-500">Must be at least 8 characters long</p>
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
                    Sending verification code...
                  </span>
                ) : (
                  'Continue to Verification'
                )}
              </button>
            </form>
          ) : (
            <form onSubmit={handleVerify} className="space-y-5">
              <div className="text-center p-4 bg-blue-50 rounded-lg border border-blue-200">
                <svg className="w-12 h-12 text-blue-500 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <p className="text-sm text-gray-700 mb-1">
                  We sent a 6-digit code to
                </p>
                <p className="text-sm font-semibold text-blue-700">{formData.email}</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 text-center">Verification Code</label>
                <input
                  name="code"
                  type="text"
                  placeholder="000000"
                  maxLength={6}
                  className="w-full px-4 py-4 border-2 border-gray-300 rounded-lg text-center text-3xl tracking-[0.5em] font-bold focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  onChange={handleChange}
                  required
                />
              </div>
              
              <button
                type="submit"
                disabled={loading}
                className={`w-full py-3 px-4 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {loading ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Verifying...
                  </span>
                ) : (
                  'Activate Account'
                )}
              </button>
              
              <button 
                type="button" 
                onClick={() => setStep(1)}
                className="w-full text-sm text-gray-600 hover:text-gray-800 font-medium transition-colors"
              >
                ← Wrong email? Go back
              </button>
            </form>
          )}
          
          {step === 1 && (
            <div className="mt-6 text-center">
              <span className="text-gray-600">Already have an account? </span>
              <Link to="/login" className="text-blue-600 hover:text-blue-700 font-semibold transition-colors">
                Login
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}