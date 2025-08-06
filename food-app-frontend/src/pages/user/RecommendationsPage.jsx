import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import DishCard from '../../components/DishCard';
import { fetchDishes } from '../../services/foodApi';
import Spinner from '../../components/common/Spinner';
import PageAnimator from '../../components/common/PageAnimator';
import AuroraBackground from '../../components/common/AuroraBackground';
import { FaSearch } from 'react-icons/fa';
import { LuChefHat } from "react-icons/lu";

const RecommendationsPage = () => {
  const [allDishes, setAllDishes] = useState([]);
  const [filteredDishes, setFilteredDishes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCuisine, setActiveCuisine] = useState('All');
  const cuisines = ['All', 'Italian', 'Japanese', 'Mexican'];

  useEffect(() => {
    const loadDishes = async () => {
      try {
        const dishes = await fetchDishes();
        setAllDishes(dishes);
        setFilteredDishes(dishes);
      } catch (error) { console.error("Failed to fetch dishes:", error); }
      finally { setLoading(false); }
    };
    loadDishes();
  }, []);

  useEffect(() => {
    let results = allDishes;
    if (activeCuisine !== 'All') {
      results = results.filter(dish => dish.cuisine === activeCuisine);
    }
    if (searchTerm) {
      results = results.filter(dish => dish.name.toLowerCase().includes(searchTerm.toLowerCase()));
    }
    setFilteredDishes(results);
  }, [searchTerm, activeCuisine, allDishes]);

  const gridVariants = { visible: { transition: { staggerChildren: 0.07 } }, hidden: {} };
  const cardVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.98 },
    visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.4, ease: 'easeOut' } },
  };

  return (
    <PageAnimator>
      <div className="relative min-h-screen pb-24 overflow-hidden">
        <AuroraBackground />
        <div className="text-center pt-16 pb-12">
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tighter">Explore Our Dishes</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto mt-4">Filter by cuisine or search for your favorites.</p>
        </div>
        <div className="sticky top-[70px] z-30 bg-gray-50/80 backdrop-blur-lg py-4 mb-12 rounded-xl shadow-sm">
            <div className="container mx-auto flex flex-col md:flex-row items-center gap-4">
                <div className="relative flex-grow w-full md:w-auto">
                    <input type="text" placeholder="Search for 'Pizza', 'Tacos'..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full py-3 pl-12 pr-4 text-md bg-white/70 border-2 border-transparent rounded-full focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/50 transition-all duration-300 shadow-sm" />
                    <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                </div>
                <div className="flex items-center gap-2 flex-wrap justify-center">
                    {cuisines.map(cuisine => (
                        <button key={cuisine} onClick={() => setActiveCuisine(cuisine)} className="relative px-4 py-2 text-sm font-semibold rounded-full transition-colors duration-300">
                            {activeCuisine === cuisine && <motion.div layoutId="active-cuisine-pill" className="absolute inset-0 bg-primary rounded-full" />}
                            <span className={`relative ${activeCuisine === cuisine ? 'text-white' : 'text-gray-700'}`}>{cuisine}</span>
                        </button>
                    ))}
                </div>
            </div>
        </div>
        {loading ? <Spinner /> : (
          <motion.div variants={gridVariants} initial="hidden" animate="visible" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            <AnimatePresence>
              {filteredDishes.length > 0 ? (
                filteredDishes.map((dish) => (
                  <motion.div key={dish.id} variants={cardVariants} exit={{ opacity: 0, scale: 0.8 }}><DishCard dish={dish} /></motion.div>
                ))
              ) : (
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="col-span-full flex flex-col items-center justify-center text-center py-20">
                    <LuChefHat className="text-7xl text-gray-300 mb-4" />
                    <h3 className="text-2xl font-bold text-gray-700">No Dishes Found</h3>
                    <p className="text-gray-500 mt-2">Try a different search or filter combination.</p>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </div>
    </PageAnimator>
  );
};
export default RecommendationsPage;