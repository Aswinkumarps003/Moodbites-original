// src/pages/SignupPage.jsx
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import axios from 'axios'; // Import axios
import PageAnimator from '../../components/common/PageAnimator';
import AuroraBackground from '../../components/common/AuroraBackground';
import { FaExclamationCircle } from 'react-icons/fa';

// Define your backend API URL
const API_URL = 'http://localhost:5000/api/user';

const SignupPage = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const response = await axios.post(`${API_URL}/register`, formData);
      // On success, save token and user data to local storage
      localStorage.setItem('authToken', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      navigate('/'); // Redirect to homepage
    } catch (err) {
      setError(err.response?.data?.message || 'An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };

  // ... (formVariants and fieldVariants remain the same)
  const formVariants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.15, delayChildren: 0.2 } } };
  const fieldVariants = { hidden: { opacity: 0, x: -20 }, visible: { opacity: 1, x: 0, transition: { type: 'spring' } } };

  return (
    <PageAnimator>
      <div className="relative flex items-center justify-center min-h-[80vh] py-12">
        <AuroraBackground />
        <motion.div className="w-full max-w-md p-8 space-y-6 bg-white/60 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20"
          initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5, ease: 'easeOut' }}
        >
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900">Create Your Account</h2>
            <p className="mt-2 text-gray-600">Join to get personalized recommendations.</p>
          </div>
          <AnimatePresence>
            {error && (
              <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-md relative flex items-center">
                <FaExclamationCircle className="mr-3" />
                <span className="block sm:inline">{error}</span>
              </motion.div>
            )}
          </AnimatePresence>
          <motion.form variants={formVariants} initial="hidden" animate="visible" className="space-y-6" onSubmit={handleSignup}>
            <motion.div variants={fieldVariants}>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">Full Name</label>
              <input id="name" type="text" required className="w-full px-4 py-2 mt-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition" placeholder="John Doe" value={formData.name} onChange={handleChange} />
            </motion.div>
            <motion.div variants={fieldVariants}>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email address</label>
              <input id="email" type="email" required className="w-full px-4 py-2 mt-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition" placeholder="you@example.com" value={formData.email} onChange={handleChange} />
            </motion.div>
            <motion.div variants={fieldVariants}>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
              <input id="password" type="password" required className="w-full px-4 py-2 mt-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition" placeholder="At least 6 characters" value={formData.password} onChange={handleChange} />
            </motion.div>
            <motion.div variants={fieldVariants}>
              <button type="submit" disabled={loading} className="group w-full relative inline-flex items-center justify-center px-8 py-3 text-lg font-bold text-white bg-gradient-to-r from-orange-500 to-orange-600 rounded-md overflow-hidden transition-all duration-300 transform hover:scale-105 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed">
                <span className="absolute top-0 left-0 w-0 h-full transition-all duration-300 ease-out bg-white/20 group-hover:w-full"></span>
                <span className="relative">{loading ? 'Creating Account...' : 'Sign Up'}</span>
              </button>
            </motion.div>
          </motion.form>
          <p className="text-sm text-center text-gray-600">Already have an account? <Link to="/login" className="font-medium text-primary hover:underline">Log in</Link></p>
        </motion.div>
      </div>
    </PageAnimator>
  );
};
export default SignupPage;