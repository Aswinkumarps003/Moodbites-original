import React, { useState, useEffect } from 'react';
import WelcomeProfile from '../../components/dashboard/WelcomeProfile';
import MoodTrackingPanel from '../../components/dashboard/MoodTrackingPanel';
import FridgeScanner from '../../components/dashboard/FridgeScanner';
import MealRecommendations from '../../components/dashboard/MealRecommendations';
import FoodLog from '../../components/dashboard/FoodLog';
import WearableData from '../../components/dashboard/WearableData';
import ChatbotWidget from '../../components/dashboard/ChatbotWidget';
import HealthReports from '../../components/dashboard/HealthReports';
import RemindersNotifications from '../../components/dashboard/RemindersNotifications';
import SettingsPreferences from '../../components/dashboard/SettingsPreferences';
import Achievements from '../../components/dashboard/Achievements';
import HelpFeedback from '../../components/dashboard/HelpFeedback';

export default function UserDashboard() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [userMood, setUserMood] = useState('neutral');
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  const getTimeBasedGreeting = () => {
    const hour = currentTime.getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-4 lg:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Main Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Left Column - Main Content */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* Welcome & Profile Overview */}
            <WelcomeProfile 
              greeting={getTimeBasedGreeting()}
              currentMood={userMood}
              currentTime={currentTime}
            />
            
            {/* Emotion & Mood Tracking */}
            <MoodTrackingPanel 
              currentMood={userMood}
              onMoodChange={setUserMood}
            />
            
            {/* Fridge Scanner & Ingredients */}
            <FridgeScanner />
            
            {/* Personalized Meal Recommendations */}
            <MealRecommendations currentMood={userMood} />
            
            {/* Food Log & Nutrition Summary */}
            <FoodLog />
            
            {/* Health Reports & AI Insights */}
            <HealthReports />
            
            {/* Achievements & Gamification */}
            <Achievements />
            
          </div>
          
          {/* Right Column - Sidebar */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Wearable Data Panel */}
            <WearableData />
            
            {/* Chatbot Widget */}
            <ChatbotWidget />
            
            {/* Reminders & Notifications */}
            <RemindersNotifications 
              notifications={notifications}
              setNotifications={setNotifications}
            />
            
            {/* Settings & Preferences */}
            <SettingsPreferences />
            
            {/* Help & Feedback */}
            <HelpFeedback />
            
          </div>
          
        </div>
      </div>
    </div>
  );
}