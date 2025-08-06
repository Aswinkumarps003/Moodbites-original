import React, { useRef, useEffect } from "react";
import { FaCamera, FaLeaf, FaAppleAlt, FaCarrot, FaFish, FaUpload, FaSearch } from "react-icons/fa";
import { motion } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
gsap.registerPlugin(ScrollTrigger);

// Dummy data with more items
const ingredients = [
  { name: "Apple", freshness: "Fresh", icon: <FaAppleAlt className="text-red-400 text-2xl" />, color: "bg-green-50", border: "border-green-200", daysLeft: "5 days" },
  { name: "Carrot", freshness: "Expiring", icon: <FaCarrot className="text-orange-400 text-2xl" />, color: "bg-yellow-50", border: "border-yellow-200", daysLeft: "2 days" },
  { name: "Salmon", freshness: "Spoiled", icon: <FaFish className="text-blue-400 text-2xl" />, color: "bg-red-50", border: "border-red-200", daysLeft: "Expired" },
  { name: "Lettuce", freshness: "Fresh", icon: <FaLeaf className="text-green-400 text-2xl" />, color: "bg-green-50", border: "border-green-200", daysLeft: "7 days" },
  { name: "Yogurt", freshness: "Expiring", icon: <span className="text-2xl">🥛</span>, color: "bg-yellow-50", border: "border-yellow-200", daysLeft: "1 day" },
  { name: "Cheese", freshness: "Fresh", icon: <span className="text-2xl">🧀</span>, color: "bg-green-50", border: "border-green-200", daysLeft: "14 days" },
  { name: "Eggs", freshness: "Fresh", icon: <span className="text-2xl">🥚</span>, color: "bg-green-50", border: "border-green-200", daysLeft: "10 days" },
  { name: "Milk", freshness: "Expiring", icon: <span className="text-2xl">🥛</span>, color: "bg-yellow-50", border: "border-yellow-200", daysLeft: "1 day" },
];

const recipes = [
  { name: "Apple Carrot Salad", desc: "Fresh and light, perfect for your mood!", img: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=facearea&w=400&h=300&q=80", time: "15 min", difficulty: "Easy" },
  { name: "Salmon Bowl", desc: "A healthy, protein-rich meal for energy.", img: "https://images.unsplash.com/photo-1519864600265-abb23847ef2c?auto=format&fit=facearea&w=400&h=300&q=80", time: "25 min", difficulty: "Medium" },
  { name: "Lettuce Wraps", desc: "Crisp and refreshing, fits your ingredients.", img: "https://images.unsplash.com/photo-1464306076886-debca5e8a6b0?auto=format&fit=facearea&w=400&h=300&q=80", time: "20 min", difficulty: "Easy" },
  { name: "Veggie Omelette", desc: "Perfect breakfast with your fresh eggs.", img: "https://images.unsplash.com/photo-1551782450-a2132b4ba21d?auto=format&fit=facearea&w=400&h=300&q=80", time: "10 min", difficulty: "Easy" },
  { name: "Yogurt Parfait", desc: "Quick snack with yogurt and fruits.", img: "https://images.unsplash.com/photo-1505576399279-565b52d4ac71?auto=format&fit=facearea&w=400&h=300&q=80", time: "5 min", difficulty: "Easy" },
];

export default function FridgeScannerPage() {
  const ingredientRef = useRef(null);
  const recipeRef = useRef(null);
  const uploadRef = useRef(null);

  useEffect(() => {
    // Upload section animation removed to prevent random opacity/transform

    // Ingredients animation
    if (ingredientRef.current) {
      gsap.fromTo(
        ingredientRef.current.querySelectorAll(".ingredient-card"),
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          stagger: 0.1,
          duration: 0.7,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ingredientRef.current,
            start: "top 80%",
          },
        }
      );
    }

    // Recipes animation
    if (recipeRef.current) {
      gsap.fromTo(
        recipeRef.current.querySelectorAll(".recipe-card"),
        { scale: 0.95, opacity: 0 },
        {
          scale: 1,
          opacity: 1,
          stagger: 0.1,
          duration: 0.7,
          ease: "power3.out",
          scrollTrigger: {
            trigger: recipeRef.current,
            start: "top 85%",
          },
        }
      );
    }
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8 flex flex-col items-center">
      {/* Header */}
      <header className="w-full max-w-7xl mx-auto mb-12 text-center">
        <motion.h1 
          className="text-4xl md:text-5xl font-bold text-gray-900 mb-4"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          Smart Fridge Scanner
        </motion.h1>
        <motion.p 
          className="text-lg text-gray-600 max-w-2xl mx-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          Scan your fridge, reduce waste, and discover delicious recipes based on what you have.
        </motion.p>
      </header>

      {/* Upload Section */}
      <section ref={uploadRef} className="w-full max-w-4xl mx-auto mb-16 relative z-10">
        <div className="relative flex flex-col items-center justify-center p-8 sm:p-10 rounded-3xl shadow-lg border border-gray-200 gap-6 overflow-hidden">
          {/* Decorative elements */}
          <div className="absolute -top-20 -right-20 w-40 h-40 rounded-full bg-indigo-100"></div>
          <div className="absolute -bottom-16 -left-16 w-32 h-32 rounded-full bg-green-100"></div>
          
          <div className="flex flex-col items-center gap-3 relative z-10">
            <div className="w-24 h-24 flex items-center justify-center rounded-full bg-white shadow-lg border border-gray-200 mb-3">
              <FaCamera className="text-5xl text-indigo-500" />
            </div>
            <div className="text-xl font-semibold text-gray-800">Upload Your Fridge Photo</div>
            <div className="text-gray-500 text-center max-w-md">
              Simply take or upload a photo of your fridge contents and we'll analyze the ingredients for you.
            </div>
            
            <motion.label 
              htmlFor="file-upload"
              className="mt-6 px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white font-medium rounded-lg cursor-pointer transition duration-300 flex items-center gap-2 shadow-md hover:shadow-lg"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
            >
              <FaUpload />
              <span>Choose Image</span>
              <input id="file-upload" type="file" className="hidden" />
            </motion.label>
            
            <div className="text-gray-400 text-sm mt-2">(Mocked upload for demonstration)</div>
          </div>
          
          {/* Mocked photo preview with bounding box */}
          <div className="relative w-full max-w-2xl h-64 sm:h-80 mt-8 rounded-xl overflow-hidden flex items-center justify-center border-2 border-dashed border-gray-300">
            <img 
              src="https://images.unsplash.com/photo-1502741338009-cac2772e18bc?auto=format&fit=facearea&w=800&h=500&q=80" 
              alt="Fridge preview" 
              className="w-full h-full object-cover" 
            />
            {/* Fake bounding boxes with labels */}
            <div className="absolute left-8 top-8 w-24 h-16 border-2 border-indigo-500 rounded-lg" style={{boxShadow:'0 0 0 2px #fff'}}>
              <div className="absolute -top-6 left-0 bg-indigo-500 text-white text-xs px-2 py-1 rounded">Apple</div>
            </div>
            <div className="absolute right-10 bottom-10 w-20 h-12 border-2 border-green-400 rounded-lg" style={{boxShadow:'0 0 0 2px #fff'}}>
              <div className="absolute -top-6 left-0 bg-green-400 text-white text-xs px-2 py-1 rounded">Lettuce</div>
            </div>
            <div className="absolute left-24 bottom-6 w-16 h-10 border-2 border-yellow-400 rounded-lg" style={{boxShadow:'0 0 0 2px #fff'}}>
              <div className="absolute -top-6 left-0 bg-yellow-400 text-white text-xs px-2 py-1 rounded">Carrot</div>
            </div>
            <div className="absolute right-16 top-12 w-14 h-10 border-2 border-red-400 rounded-lg" style={{boxShadow:'0 0 0 2px #fff'}}>
              <div className="absolute -top-6 left-0 bg-red-400 text-white text-xs px-2 py-1 rounded">Salmon</div>
            </div>
          </div>
        </div>
      </section>

      {/* Ingredient Cards Section */}
      <section ref={ingredientRef} className="w-full max-w-7xl mx-auto mb-20 px-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <h2 className="text-3xl font-bold text-gray-900">Detected Ingredients</h2>
          <div className="relative w-full sm:w-64">
            <input 
              type="text" 
              placeholder="Search ingredients..." 
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
            <FaSearch className="absolute left-3 top-3 text-gray-400" />
          </div>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {ingredients.map((ing, i) => (
            <motion.div
              key={ing.name}
              className={`ingredient-card flex flex-col items-start gap-3 p-5 rounded-xl shadow-sm ${ing.color} border ${ing.border} hover:shadow-md transition duration-300 relative overflow-hidden`}
              whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(0,0,0,0.1)" }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
            >
              <div className="absolute top-3 right-3 text-xs font-medium text-gray-500">{ing.daysLeft}</div>
              <div className="w-12 h-12 flex items-center justify-center rounded-lg bg-white shadow-sm mb-2">
                {ing.icon}
              </div>
              <div className="text-xl font-bold text-gray-900">{ing.name}</div>
              <div className={`px-3 py-1 rounded-full text-xs font-semibold ${ing.freshness === "Fresh" ? "bg-green-100 text-green-800" : ing.freshness === "Expiring" ? "bg-yellow-100 text-yellow-800" : "bg-red-100 text-red-800"}`}>
                {ing.freshness}
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Recipe Carousel Section */}
      <section ref={recipeRef} className="w-full max-w-7xl mx-auto px-4 mb-16">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <h2 className="text-3xl font-bold text-gray-900">Recommended Recipes</h2>
          <div className="flex gap-2">
            <button className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition duration-300">
              All Recipes
            </button>
            <button className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition duration-300">
              Best Matches
            </button>
          </div>
        </div>
        
        <div className="flex gap-6 overflow-x-auto pb-6 hide-scrollbar px-2 -mx-2">
          {recipes.map((rec, i) => (
            <motion.div
              key={rec.name}
              className="recipe-card w-72 flex-shrink-0 bg-white rounded-xl shadow-md border border-gray-100 flex flex-col overflow-hidden hover:shadow-lg transition duration-300 ease-in-out"
              whileHover={{ scale: 1.02 }}
            >
              <div className="h-48 w-full bg-gray-200 flex items-center justify-center overflow-hidden relative">
                <img src={rec.img} alt={rec.name} className="object-cover w-full h-full" />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                  <div className="flex justify-between text-white text-sm">
                    <span>{rec.time}</span>
                    <span>{rec.difficulty}</span>
                  </div>
                </div>
              </div>
              <div className="p-5 flex flex-col gap-3">
                <div className="text-xl font-bold text-gray-900">{rec.name}</div>
                <div className="text-gray-500 text-sm">{rec.desc}</div>
                <div className="mt-3 flex justify-between items-center">
                  <button className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white text-sm font-medium rounded-lg transition duration-300">
                    View Recipe
                  </button>
                  <span className="text-xs text-gray-400">Uses 3 ingredients</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      
      <style jsx>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        } 
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
} 