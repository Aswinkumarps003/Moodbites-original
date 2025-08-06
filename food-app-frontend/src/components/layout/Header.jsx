import { Link, NavLink, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { FaBars, FaTimes, FaUserCircle } from 'react-icons/fa';

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [profileDropdown, setProfileDropdown] = useState(false);
  const navigate = useNavigate();
  const activeClass = "text-primary relative";
  const inactiveClass = "text-text-secondary hover:text-primary transition-colors";

  useEffect(() => {
    const checkLoginStatus = () => {
      const token = localStorage.getItem('authToken');
      const newLoginStatus = !!token;
      console.log('Checking login status - token:', token, 'isLoggedIn:', newLoginStatus);
      setIsLoggedIn(newLoginStatus);
    };
    
    checkLoginStatus();
    
    const handleStorage = () => {
      console.log('Storage event triggered');
      checkLoginStatus();
    };
    
    const handleCustomLogout = () => {
      console.log('Custom logout event triggered');
      setIsLoggedIn(false);
    };
    
    window.addEventListener('storage', handleStorage);
    window.addEventListener('moodbites-logout', handleCustomLogout);
    
    return () => {
      window.removeEventListener('storage', handleStorage);
      window.removeEventListener('moodbites-logout', handleCustomLogout);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    setIsLoggedIn(false); // Local update
    console.log('Logout: removed authToken and user, updating state and dispatching event');
    // Dispatch a custom event manually for same-tab and cross-tab sync
    window.dispatchEvent(new Event('moodbites-logout'));
    navigate('/'); // Navigate to home
  };
  

  return (
    <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-lg border-b border-orange-100">
      <div className="container mx-auto flex justify-between items-center p-4 relative">
        <Link to="/" className="text-2xl font-bold text-primary">
          MoodBites
        </Link>
        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center space-x-8">
          <NavLink to="/" className={({ isActive }) => (isActive ? activeClass : inactiveClass)}>Home</NavLink>
          <NavLink to="/recommendations" className={({ isActive }) => (isActive ? activeClass : inactiveClass)}>Recommendations</NavLink>
          <NavLink to="/emotion-detection" className={({ isActive }) => (isActive ? activeClass : inactiveClass)}>Mood</NavLink>
          <NavLink to="/fridge-scanner" className={({ isActive }) => (isActive ? activeClass : inactiveClass)}>Fridge Scanner</NavLink>
          <NavLink to="/share-recipe" className={({ isActive }) => (isActive ? activeClass : inactiveClass)}>Share Recipe</NavLink>
          <NavLink to="/about" className={({ isActive }) => (isActive ? activeClass : inactiveClass)}>About</NavLink>
          <NavLink to="/admin" className={({ isActive }) => (isActive ? activeClass : inactiveClass)}>Admin</NavLink>
        </nav>
        {/* Desktop Auth/Profile Buttons */}
        <div className="hidden md:flex items-center space-x-2 relative">
          {!isLoggedIn ? (
            <>
              <Link to="/login" className="px-4 py-2 text-sm font-semibold text-primary rounded-full hover:bg-orange-100/50 transition-colors">
                Log In
              </Link>
              <Link to="/signup" className="group relative inline-flex items-center justify-center px-5 py-2 text-sm font-bold text-white bg-gradient-to-r from-orange-500 to-orange-600 rounded-full overflow-hidden transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-lg hover:shadow-primary/30">
                <span className="absolute top-0 left-0 w-0 h-full transition-all duration-300 ease-out bg-white/20 group-hover:w-full"></span>
                <span className="relative">Sign Up</span>
              </Link>
            </>
          ) : (
            <>
              <Link
                to="/profile"
                className="flex items-center justify-center w-10 h-10 text-xl text-primary rounded-full hover:bg-orange-100/50 transition-colors focus:outline-none"
                aria-label="User profile"
              >
                <FaUserCircle />
                  </Link>
                  <button
                className="px-4 py-2 text-sm font-semibold text-red-600 rounded-full hover:bg-orange-100/50 transition-colors ml-2"
                    onClick={handleLogout}
                  >
                    Log Out
                  </button>
            </>
          )}
        </div>
        {/* Hamburger for Mobile */}
        <button className="md:hidden p-2 rounded-full border border-gray-200 bg-white shadow-lg z-50" onClick={() => setMenuOpen(true)} aria-label="Open menu">
          <FaBars className="w-6 h-6 text-primary" />
        </button>
        {/* Mobile Menu Overlay and Sidebar */}
        <AnimatePresence>
          {menuOpen && (
            <>
              {/* Overlay */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/40 z-40"
                onClick={() => setMenuOpen(false)}
              />
              {/* Sidebar */}
              <motion.div
                initial={{ x: '-100%', opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: '-100%', opacity: 0 }}
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                className="fixed top-0 left-0 h-full w-4/5 max-w-xs bg-white z-50 shadow-2xl p-6 flex flex-col gap-6"
                onClick={e => e.stopPropagation()}
              >
                <button className="absolute top-4 right-4 p-2 rounded-full border border-gray-200 bg-white shadow" onClick={() => setMenuOpen(false)} aria-label="Close menu">
                  <FaTimes className="w-5 h-5 text-primary" />
                </button>
                <Link to="/" className="text-2xl font-bold text-primary mb-6" onClick={() => setMenuOpen(false)}>
                  MoodBites
                </Link>
                <NavLink to="/" className={({ isActive }) => (isActive ? activeClass : inactiveClass) + " text-lg py-2"} onClick={() => setMenuOpen(false)}>
                  Home
                </NavLink>
                <NavLink to="/recommendations" className={({ isActive }) => (isActive ? activeClass : inactiveClass) + " text-lg py-2"} onClick={() => setMenuOpen(false)}>
                  Recommendations
                </NavLink>
                <NavLink to="/emotion-detection" className={({ isActive }) => (isActive ? activeClass : inactiveClass) + " text-lg py-2"} onClick={() => setMenuOpen(false)}>
                  Mood
                </NavLink>
                <NavLink to="/fridge-scanner" className={({ isActive }) => (isActive ? activeClass : inactiveClass) + " text-lg py-2"} onClick={() => setMenuOpen(false)}>
                  Fridge Scanner
                </NavLink>
                <NavLink to="/share-recipe" className={({ isActive }) => (isActive ? activeClass : inactiveClass) + " text-lg py-2"} onClick={() => setMenuOpen(false)}>
                  Share Recipe
                </NavLink>
                <NavLink to="/about" className={({ isActive }) => (isActive ? activeClass : inactiveClass) + " text-lg py-2"} onClick={() => setMenuOpen(false)}>
                  About
                </NavLink>
                <NavLink to="/admin" className={({ isActive }) => (isActive ? activeClass : inactiveClass) + " text-lg py-2"} onClick={() => setMenuOpen(false)}>
                  Admin
                </NavLink>
                <div className="flex flex-col gap-2 mt-6">
                  {!isLoggedIn ? (
                    <>
                      <Link to="/login" className="px-4 py-2 text-sm font-semibold text-primary rounded-full hover:bg-orange-100/50 transition-colors text-left" onClick={() => setMenuOpen(false)}>
                        Log In
                      </Link>
                      <Link to="/signup" className="px-4 py-2 text-sm font-bold text-white bg-gradient-to-r from-orange-500 to-orange-600 rounded-full transition-all duration-300 shadow-md text-left" onClick={() => setMenuOpen(false)}>
                        Sign Up
                      </Link>
                    </>
                  ) : (
                    <button
                      className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-primary rounded-full hover:bg-orange-100/50 transition-colors text-left"
                      onClick={() => { setMenuOpen(false); handleLogout(); }}
                    >
                      <FaUserCircle className="text-xl" /> Log Out
                    </button>
                  )}
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
};

export default Header;