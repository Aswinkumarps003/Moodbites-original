import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { fetchDishById } from '../../services/foodApi';
import Spinner from '../../components/common/Spinner';
import NotFoundPage from './NotFoundPage';
import { FaStar, FaArrowLeft } from 'react-icons/fa';

const DishDetailPage = () => {
  const { id } = useParams();
  const [dish, setDish] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const getDish = async () => {
      try {
        setLoading(true);
        const dishData = await fetchDishById(id);
        setDish(dishData);
      } catch (err) { setError(true); }
      finally { setLoading(false); }
    };
    getDish();
  }, [id]);

  if (loading) return <div className="min-h-screen flex items-center justify-center"><Spinner /></div>;
  if (error || !dish) return <NotFoundPage />;

  const contentVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.4 } }
  };
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { type: 'spring' } }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <motion.div layoutId={`card-container-${dish.id}`} className="relative max-w-5xl mx-auto my-8 md:my-16 bg-white/60 backdrop-blur-2xl rounded-3xl shadow-2xl overflow-hidden">
        <div className="grid md:grid-cols-2">
          <motion.div layoutId={`card-image-${dish.id}`} className="relative"><img src={dish.image} alt={dish.name} className="w-full h-64 md:h-full object-cover" /></motion.div>
          <motion.div variants={contentVariants} initial="hidden" animate="visible" className="p-8 md:p-12 flex flex-col">
            <motion.div variants={itemVariants}>
              <Link to="/recommendations" className="inline-flex items-center text-primary font-semibold mb-4 hover:underline"><FaArrowLeft className="mr-2"/> Back to Recommendations</Link>
            </motion.div>
            <motion.p variants={itemVariants} className="inline-block bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-semibold mb-4 w-fit">{dish.cuisine}</motion.p>
            <motion.h1 variants={itemVariants} className="text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tighter mb-2">{dish.name}</motion.h1>
            <motion.div variants={itemVariants} className="flex items-center text-lg font-bold text-amber-500 mb-6"><FaStar className="mr-2" /> {dish.rating} / 5.0</motion.div>
            <motion.p variants={itemVariants} className="text-gray-600 leading-relaxed mb-8">{dish.description}</motion.p>
            <motion.div variants={itemVariants}>
                <h2 className="text-xl font-bold text-gray-800 mb-4">Ingredients</h2>
                <div className="flex flex-wrap gap-2">
                    {dish.ingredients.map((item, index) => (<span key={index} className="bg-gray-200 text-gray-700 px-3 py-1 rounded-full text-sm">{item}</span>))}
                </div>
            </motion.div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};
export default DishDetailPage;