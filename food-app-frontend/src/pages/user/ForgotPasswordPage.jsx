// src/pages/ForgotPasswordPage.jsx
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import axios from 'axios';
import PageAnimator from '../../components/common/PageAnimator';
import AuroraBackground from '../../components/common/AuroraBackground';
import { FaExclamationCircle, FaCheckCircle, FaArrowLeft } from 'react-icons/fa';

const API_URL = 'http://localhost:5000/api/user';

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);
    
    try {
      const response = await axios.post(`${API_URL}/forgot-password`, { email });
      setSuccess(true);
    } catch (err) {
      setError(err.response?.data?.message || 'An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };

  const formVariants = { 
    hidden: { opacity: 0 }, 
    visible: { opacity: 1, transition: { staggerChildren: 0.15, delayChildren: 0.2 } } 
  };
  
  const fieldVariants = { 
    hidden: { opacity: 0, x: -20 }, 
    visible: { opacity: 1, x: 0, transition: { type: 'spring' } } 
  };

  return (
    <PageAnimator>
      <div className="relative flex items-center justify-center min-h-[80vh] py-12">
        <AuroraBackground />
        <motion.div className="w-full max-w-md p-8 space-y-6 bg-white/60 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20"
          initial={{ opacity: 0, scale: 0.9 }} 
          animate={{ opacity: 1, scale: 1 }} 
          transition={{ duration: 0.5, ease: 'easeOut' }}
        >
          {/* Back Button */}
          <div className="flex items-center mb-4">
            <Link to="/login" className="flex items-center text-orange-600 hover:text-orange-800 transition-colors">
              <FaArrowLeft className="mr-2" />
              <span className="text-sm font-medium">Back to Login</span>
            </Link>
          </div>

          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900">Reset Password</h2>
            <p className="mt-2 text-gray-600">
              Enter your email address and we'll send you a link to reset your password.
            </p>
          </div>

          <AnimatePresence>
            {error && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }} 
                animate={{ opacity: 1, y: 0 }} 
                exit={{ opacity: 0, y: -10 }} 
                className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-md relative flex items-center"
              >
                <FaExclamationCircle className="mr-3" />
                <span className="block sm:inline">{error}</span>
              </motion.div>
            )}
            
            {success && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }} 
                animate={{ opacity: 1, y: 0 }} 
                exit={{ opacity: 0, y: -10 }} 
                className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-md relative flex items-center"
              >
                <FaCheckCircle className="mr-3" />
                <span className="block sm:inline">
                  Password reset link sent! Please check your email.
                </span>
              </motion.div>
            )}
          </AnimatePresence>

          {!success ? (
            <motion.form 
              variants={formVariants} 
              initial="hidden" 
              animate="visible" 
              className="space-y-6" 
              onSubmit={handleSubmit}
            >
              <motion.div variants={fieldVariants}>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email address
                </label>
                <input 
                  id="email" 
                  type="email" 
                  required 
                  className="w-full px-4 py-2 mt-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition" 
                  placeholder="you@example.com" 
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)} 
                />
              </motion.div>
              
              <motion.div variants={fieldVariants}>
                <button 
                  type="submit" 
                  disabled={loading} 
                  className="group w-full relative inline-flex items-center justify-center px-8 py-3 text-lg font-bold text-white bg-gradient-to-r from-orange-500 to-orange-600 rounded-md overflow-hidden transition-all duration-300 transform hover:scale-105 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span className="absolute top-0 left-0 w-0 h-full transition-all duration-300 ease-out bg-white/20 group-hover:w-full"></span>
                  <span className="relative">
                    {loading ? 'Sending Reset Link...' : 'Send Reset Link'}
                  </span>
                </button>
              </motion.div>
            </motion.form>
          ) : (
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              className="text-center space-y-4"
            >
              <div className="text-green-600 text-6xl mb-4">
                <FaCheckCircle />
              </div>
              <p className="text-gray-600">
                We've sent a password reset link to <strong>{email}</strong>
              </p>
              <p className="text-sm text-gray-500">
                Please check your email and click the link to reset your password.
              </p>
              <div className="pt-4">
                <Link 
                  to="/login" 
                  className="inline-block px-6 py-2 text-sm font-medium text-orange-600 hover:text-orange-800 hover:underline"
                >
                  Back to Login
                </Link>
              </div>
            </motion.div>
          )}

          <div className="text-center pt-4 border-t border-gray-200">
            <p className="text-sm text-gray-600">
              Remember your password?{' '}
              <Link to="/login" className="font-medium text-orange-600 hover:text-orange-800 hover:underline">
                Log in
              </Link>
            </p>
          </div>
        </motion.div>
      </div>
    </PageAnimator>
  );
};

export default ForgotPasswordPage; 