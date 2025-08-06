import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaStar } from 'react-icons/fa';

const DishCard = ({ dish }) => {
  return (
    <motion.div layoutId={`card-container-${dish.id}`} className="h-full">
      <Link
        to={`/dish/${dish.id}`}
        className="block bg-white/60 backdrop-blur-lg rounded-2xl shadow-lg overflow-hidden h-full group border border-white/20 transition-shadow duration-300 hover:shadow-primary/20 hover:shadow-2xl"
      >
        <div className="relative overflow-hidden">
          <motion.img
            layoutId={`card-image-${dish.id}`}
            src={dish.image}
            alt={dish.name}
            className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
          />
          <div className="absolute top-3 right-3 bg-white/80 backdrop-blur-sm px-3 py-1 rounded-full flex items-center space-x-1 text-sm font-semibold shadow">
            <FaStar className="text-amber-500" />
            <span>{dish.rating}</span>
          </div>
        </div>
        <div className="p-5">
          <h3 className="text-xl font-bold mb-1 text-gray-800 truncate">{dish.name}</h3>
          <p className="text-gray-600 font-medium">{dish.cuisine}</p>
        </div>
      </Link>
    </motion.div>
  );
};

export default DishCard;