import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import Layout from './components/layout/Layout';
import HomePage from './pages/user/HomePage';
import RecommendationsPage from './pages/user/RecommendationsPage';
import DishDetailPage from './pages/user/DishDetailPage';
import AboutPage from './pages/user/AboutPage';
import LoginPage from './pages/user/LoginPage';
import SignupPage from './pages/user/SignupPage';
import NotFoundPage from './pages/user/NotFoundPage';
import AdminLayout from './pages/admin/AdminLayout';
import AdminDashboard from './pages/admin/Admindashboard';
import Users from './pages/admin/Users';
import Dishes from './pages/admin/Dishes';
import Analytics from './pages/admin/Analytics';
import Settings from './pages/admin/Settings';
import Orders from './pages/admin/Orders';
import Notifications from './pages/admin/Notifications';
import Profile from './pages/admin/Profile';
import ActivityLog from './pages/admin/ActivityLog';
import AdminNotFound from './pages/admin/AdminNotFound';
import UserDashboard from './pages/userprofile/UserDashboard';
import EmotionDetectionPage from './pages/user/EmotionDetectionPage';
import FridgeScannerPage from './pages/user/FridgeScannerPage';
import ShareRecipePage from './pages/user/ShareRecipePage';
import ForgotPasswordPage from './pages/user/ForgotPasswordPage';
import ResetPasswordPage from './pages/user/ResetPasswordPage';
import UserProfilePage from './pages/user/UserProfilePage';

function App() {
  const location = useLocation();

  return (
    <>
      <Routes location={location} key={location.pathname}>
        <Route element={<Layout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/recommendations" element={<RecommendationsPage />} />
          <Route path="/dish/:id" element={<DishDetailPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />
          <Route path="/profile" element={<UserProfilePage />} />
          <Route path="/user/dashboard" element={<UserDashboard />} />
          <Route path="/emotion-detection" element={<EmotionDetectionPage />} />
          <Route path="/fridge-scanner" element={<FridgeScannerPage />} />
          <Route path="/share-recipe" element={<ShareRecipePage />} />
        </Route>
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="users" element={<Users />} />
          <Route path="dishes" element={<Dishes />} />
          <Route path="orders" element={<Orders />} />
          <Route path="analytics" element={<Analytics />} />
          <Route path="notifications" element={<Notifications />} />
          <Route path="profile" element={<Profile />} />
          <Route path="activity-log" element={<ActivityLog />} />
          <Route path="settings" element={<Settings />} />
          <Route path="*" element={<AdminNotFound />} />
        </Route>
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </>
  );
}

export default App;