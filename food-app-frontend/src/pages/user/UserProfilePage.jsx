// src/pages/user/UserProfilePage.jsx
import { useEffect, useState } from 'react';
import { FaUserCircle, FaTrophy, FaMedal, FaWater, FaAppleAlt, FaFire } from 'react-icons/fa';

const mockWellness = {
  mealsLogged: 42,
  calories: 1850,
  water: 2.5, // liters
  steps: 8000,
};

const mockGamification = {
  points: 320,
  level: 4,
  nextLevelPoints: 400,
};

const getLevelProgress = (points, nextLevelPoints) => Math.min(100, Math.round((points / nextLevelPoints) * 100));

const UserProfilePage = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Get user from localStorage (set after login)
    const userData = localStorage.getItem('user');
    if (userData) setUser(JSON.parse(userData));
  }, []);

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-[80vh]">
        <div className="bg-white/80 p-8 rounded-xl shadow-xl text-center">
          <FaUserCircle className="text-6xl text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-bold mb-2">User not logged in</h2>
          <p className="mb-4">Please log in to view your profile.</p>
        </div>
      </div>
    );
  }

  const profilePic = user.profilePic || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=ff9800&color=fff&size=128`;

  return (
    <div className="min-h-[90vh] bg-gradient-to-br from-orange-50 via-yellow-50 to-pink-50 py-10 px-4 flex flex-col items-center">
      <div className="w-full max-w-3xl bg-white/90 rounded-3xl shadow-2xl p-8 border border-white/30">
        {/* Profile Header */}
        <div className="flex flex-col md:flex-row items-center gap-8 mb-8">
          <img
            src={profilePic}
            alt="Profile"
            className="w-32 h-32 rounded-full border-4 border-orange-400 shadow-lg object-cover"
          />
          <div className="flex-1 text-center md:text-left">
            <h2 className="text-3xl font-extrabold text-orange-700 mb-1">{user.name}</h2>
            <p className="text-gray-600 text-lg mb-2">{user.email}</p>
            <span className="inline-block bg-orange-100 text-orange-700 px-4 py-1 rounded-full text-sm font-semibold">
              {user.role === 0 ? 'Admin' : user.role === 1 ? 'User' : user.role === 2 ? 'Gym Goer' : user.role === 3 ? 'Dietician' : 'User'}
            </span>
          </div>
        </div>

        {/* Wellness Dashboard */}
        <div className="mb-8">
          <h3 className="text-xl font-bold text-orange-700 mb-4 flex items-center gap-2">
            <FaAppleAlt className="text-orange-500" /> Wellness Dashboard
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-orange-50 rounded-xl p-4 flex flex-col items-center shadow">
              <FaAppleAlt className="text-2xl text-orange-400 mb-2" />
              <span className="text-lg font-bold">{mockWellness.mealsLogged}</span>
              <span className="text-xs text-gray-500">Meals Logged</span>
            </div>
            <div className="bg-orange-50 rounded-xl p-4 flex flex-col items-center shadow">
              <FaFire className="text-2xl text-orange-400 mb-2" />
              <span className="text-lg font-bold">{mockWellness.calories}</span>
              <span className="text-xs text-gray-500">Calories Today</span>
            </div>
            <div className="bg-orange-50 rounded-xl p-4 flex flex-col items-center shadow">
              <FaWater className="text-2xl text-orange-400 mb-2" />
              <span className="text-lg font-bold">{mockWellness.water}L</span>
              <span className="text-xs text-gray-500">Water Intake</span>
            </div>
            <div className="bg-orange-50 rounded-xl p-4 flex flex-col items-center shadow">
              <FaMedal className="text-2xl text-orange-400 mb-2" />
              <span className="text-lg font-bold">{mockWellness.steps}</span>
              <span className="text-xs text-gray-500">Steps</span>
            </div>
          </div>
        </div>

        {/* Gamification */}
        <div>
          <h3 className="text-xl font-bold text-orange-700 mb-4 flex items-center gap-2">
            <FaTrophy className="text-yellow-500" /> Gamification
          </h3>
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-lg font-bold text-orange-700">Level {mockGamification.level}</span>
                <FaMedal className="text-orange-400" />
              </div>
              <div className="w-full bg-orange-100 rounded-full h-4 mb-2">
                <div
                  className="bg-gradient-to-r from-orange-400 to-orange-600 h-4 rounded-full"
                  style={{ width: `${getLevelProgress(mockGamification.points, mockGamification.nextLevelPoints)}%` }}
                ></div>
              </div>
              <div className="text-sm text-gray-600">
                {mockGamification.points} / {mockGamification.nextLevelPoints} points to next level
              </div>
            </div>
            <div className="flex flex-col items-center">
              <FaTrophy className="text-5xl text-yellow-400 mb-2" />
              <span className="text-lg font-bold text-yellow-700">+{mockGamification.points} Points</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfilePage;
