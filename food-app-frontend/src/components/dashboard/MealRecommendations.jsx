import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FaUtensils, FaHeart, FaStar, FaExchangeAlt, FaInfoCircle, FaBookmark } from 'react-icons/fa';

const MealRecommendations = ({ currentMood }) => {
  const [selectedMeal, setSelectedMeal] = useState(null);

  // Mock meal recommendations based on mood
  const getMealsByMood = (mood) => {
    const mealDatabase = {
      happy: [
        {
          id: 1,
          name: "Rainbow Veggie Bowl",
          image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=300&h=200&fit=crop",
          calories: 450,
          protein: 15,
          carbs: 65,
          fat: 12,
          cookTime: "25 min",
          moodTag: "Energizing",
          reason: "Colorful vegetables boost serotonin and maintain your happy mood",
          ingredients: ["Bell peppers", "Spinach", "Quinoa", "Chickpeas"],
          difficulty: "Easy"
        },
        {
          id: 2,
          name: "Grilled Paneer Salad",
          image: "https://images.unsplash.com/photo-1540420773420-3366772f4999?w=300&h=200&fit=crop",
          calories: 380,
          protein: 22,
          carbs: 25,
          fat: 18,
          cookTime: "15 min",
          moodTag: "Light & Fresh",
          reason: "Light meal that keeps you feeling positive and energized",
          ingredients: ["Paneer", "Mixed greens", "Tomatoes", "Cucumber"],
          difficulty: "Easy"
        }
      ],
      stressed: [
        {
          id: 3,
          name: "Calming Chamomile Oats",
          image: "https://images.unsplash.com/photo-1517686469429-8bdb88b9f907?w=300&h=200&fit=crop",
          calories: 320,
          protein: 12,
          carbs: 55,
          fat: 8,
          cookTime: "10 min",
          moodTag: "Comfort Food",
          reason: "Oats release serotonin to help reduce stress and anxiety",
          ingredients: ["Oats", "Milk", "Honey", "Almonds"],
          difficulty: "Very Easy"
        },
        {
          id: 4,
          name: "Warm Lentil Soup",
          image: "https://images.unsplash.com/photo-1547592166-23ac45744acd?w=300&h=200&fit=crop",
          calories: 280,
          protein: 18,
          carbs: 45,
          fat: 5,
          cookTime: "30 min",
          moodTag: "Soothing",
          reason: "Warm, protein-rich meal that provides comfort and stability",
          ingredients: ["Red lentils", "Vegetables", "Turmeric", "Ginger"],
          difficulty: "Medium"
        }
      ],
      neutral: [
        {
          id: 5,
          name: "Balanced Protein Bowl",
          image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=300&h=200&fit=crop",
          calories: 520,
          protein: 28,
          carbs: 45,
          fat: 22,
          cookTime: "20 min",
          moodTag: "Balanced",
          reason: "Perfect macronutrient balance for sustained energy",
          ingredients: ["Chicken", "Rice", "Broccoli", "Avocado"],
          difficulty: "Medium"
        }
      ]
    };

    return mealDatabase[mood] || mealDatabase.neutral;
  };

  const todaysMeals = {
    breakfast: getMealsByMood(currentMood)[0],
    lunch: getMealsByMood(currentMood)[1] || getMealsByMood('neutral')[0],
    snack: {
      id: 6,
      name: "Energy Smoothie",
      image: "https://images.unsplash.com/photo-1553530666-ba11a7da3888?w=300&h=200&fit=crop",
      calories: 180,
      protein: 8,
      carbs: 25,
      fat: 6,
      cookTime: "5 min",
      moodTag: "Refreshing",
      reason: "Quick energy boost with natural sugars and protein",
      ingredients: ["Banana", "Spinach", "Protein powder", "Almond milk"],
      difficulty: "Very Easy"
    },
    dinner: getMealsByMood(currentMood)[0]
  };

  const handleSwapMeal = (mealType) => {
    // In real app, this would fetch alternative recommendations
    console.log(`Swapping ${mealType} meal`);
  };

  const handleSaveToFavorites = (meal) => {
    console.log(`Saved ${meal.name} to favorites`);
  };

  return (
    <motion.div
      className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
    >
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
          <FaUtensils className="text-indigo-600" />
          Today's Meal Plan
        </h2>
        <div className="text-sm text-gray-600 bg-gray-100 px-3 py-1 rounded-full">
          Mood: {currentMood}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {Object.entries(todaysMeals).map(([mealType, meal]) => (
          <motion.div
            key={mealType}
            className="bg-gray-50 rounded-xl p-4 hover:shadow-md transition-shadow"
            whileHover={{ y: -2 }}
          >
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-gray-900 capitalize">{mealType}</h3>
              <span className={`px-2 py-1 text-xs rounded-full ${
                meal.moodTag === 'Energizing' ? 'bg-green-100 text-green-700' :
                meal.moodTag === 'Comfort Food' ? 'bg-orange-100 text-orange-700' :
                meal.moodTag === 'Soothing' ? 'bg-blue-100 text-blue-700' :
                'bg-purple-100 text-purple-700'
              }`}>
                {meal.moodTag}
              </span>
            </div>

            <img
              src={meal.image}
              alt={meal.name}
              className="w-full h-32 object-cover rounded-lg mb-3"
            />

            <h4 className="font-semibold text-gray-900 mb-2">{meal.name}</h4>
            
            <div className="grid grid-cols-2 gap-2 text-xs text-gray-600 mb-3">
              <div>🔥 {meal.calories} cal</div>
              <div>⏱️ {meal.cookTime}</div>
              <div>🥩 {meal.protein}g protein</div>
              <div>📊 {meal.difficulty}</div>
            </div>

            <div className="mb-3">
              <div className="flex items-center gap-1 mb-1">
                <FaInfoCircle className="text-indigo-600 text-xs" />
                <span className="text-xs font-medium text-gray-700">Why this meal?</span>
              </div>
              <p className="text-xs text-gray-600">{meal.reason}</p>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => handleSwapMeal(mealType)}
                className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors text-xs"
              >
                <FaExchangeAlt className="text-xs" />
                Swap
              </button>
              <button
                onClick={() => handleSaveToFavorites(meal)}
                className="flex items-center justify-center px-3 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
              >
                <FaBookmark className="text-xs" />
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Nutrition Summary */}
      <div className="mt-6 p-4 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg">
        <h3 className="font-semibold text-gray-900 mb-3">Daily Nutrition Summary</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-indigo-600">
              {Object.values(todaysMeals).reduce((sum, meal) => sum + meal.calories, 0)}
            </div>
            <div className="text-sm text-gray-600">Total Calories</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">
              {Object.values(todaysMeals).reduce((sum, meal) => sum + meal.protein, 0)}g
            </div>
            <div className="text-sm text-gray-600">Protein</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-yellow-600">
              {Object.values(todaysMeals).reduce((sum, meal) => sum + meal.carbs, 0)}g
            </div>
            <div className="text-sm text-gray-600">Carbs</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-red-600">
              {Object.values(todaysMeals).reduce((sum, meal) => sum + meal.fat, 0)}g
            </div>
            <div className="text-sm text-gray-600">Fat</div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default MealRecommendations;
