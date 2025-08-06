// src/pages/user/ResetPasswordPage.jsx
import { useState } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import PageAnimator from '../../components/common/PageAnimator';
import AuroraBackground from '../../components/common/AuroraBackground';
import { FaExclamationCircle, FaCheckCircle } from 'react-icons/fa';

const API_URL = 'http://localhost:5000/api/user';

const ResetPasswordPage = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  if (!token) {
    return (
      <PageAnimator>
        <div className="flex items-center justify-center min-h-[80vh]">
          <div className="bg-white/80 p-8 rounded-xl shadow-xl text-center">
            <FaExclamationCircle className="text-4xl text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-bold mb-2">Invalid or missing token</h2>
            <p className="mb-4">The password reset link is invalid or expired.</p>
            <Link to="/forgot-password" className="text-orange-600 hover:underline">Request a new link</Link>
          </div>
        </div>
      </PageAnimator>
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    if (password !== confirm) {
      setError('Passwords do not match.');
      return;
    }
    setLoading(true);
    try {
      await axios.post(`${API_URL}/reset-password`, { token, password });
      setSuccess(true);
    } catch (err) {
      setError(err.response?.data?.message || 'An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageAnimator>
      <div className="relative flex items-center justify-center min-h-[80vh] py-12">
        <AuroraBackground />
        <motion.div className="w-full max-w-md p-8 space-y-6 bg-white/60 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20"
          initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5, ease: 'easeOut' }}
        >
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900">Reset Your Password</h2>
            <p className="mt-2 text-gray-600">Enter your new password below.</p>
          </div>
          <AnimatePresence>
            {error && (
              <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-md relative flex items-center">
                <FaExclamationCircle className="mr-3" />
                <span className="block sm:inline">{error}</span>
              </motion.div>
            )}
            {success && (
              <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-md relative flex items-center">
                <FaCheckCircle className="mr-3" />
                <span className="block sm:inline">Password reset successful!</span>
              </motion.div>
            )}
          </AnimatePresence>
          {!success ? (
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">New Password</label>
                <input id="password" type="password" required minLength={6} className="w-full px-4 py-2 mt-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition" value={password} onChange={e => setPassword(e.target.value)} />
              </div>
              <div>
                <label htmlFor="confirm" className="block text-sm font-medium text-gray-700">Confirm Password</label>
                <input id="confirm" type="password" required minLength={6} className="w-full px-4 py-2 mt-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition" value={confirm} onChange={e => setConfirm(e.target.value)} />
              </div>
              <button type="submit" disabled={loading} className="w-full px-8 py-3 text-lg font-bold text-white bg-gradient-to-r from-orange-500 to-orange-600 rounded-md transition-all duration-300 transform hover:scale-105 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed">
                {loading ? 'Resetting...' : 'Reset Password'}
              </button>
            </form>
          ) : (
            <div className="text-center space-y-4">
              <div className="text-green-600 text-6xl mb-4">
                <FaCheckCircle />
              </div>
              <p className="text-gray-700">Your password has been reset successfully.</p>
              <Link to="/login" className="inline-block px-6 py-2 text-sm font-medium text-orange-600 hover:text-orange-800 hover:underline">
                Go to Login
              </Link>
            </div>
          )}
        </motion.div>
      </div>
    </PageAnimator>
  );
};

export default ResetPasswordPage;