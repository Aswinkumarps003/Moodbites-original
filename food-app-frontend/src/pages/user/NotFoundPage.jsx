import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import AuroraBackground from '../../components/common/AuroraBackground';
import { LuUtensilsCrossed } from "react-icons/lu";

const NotFoundPage = () => {
  return (
    <div className="relative flex flex-col items-center justify-center min-h-[80vh] text-center overflow-hidden">
        <AuroraBackground />
        <motion.div
            initial={{ opacity: 0, y: -50, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ type: 'spring', damping: 10, stiffness: 100, duration: 0.5 }}
        >
            <LuUtensilsCrossed className="text-8xl text-primary mx-auto mb-6" />
            <h1 className="text-6xl md:text-9xl font-extrabold text-gray-800 tracking-tighter">404</h1>
            <p className="text-2xl font-semibold text-gray-600 mt-4">Page Not Found</p>
            <p className="text-gray-500 mt-2">Sorry, the page you're looking for seems to have gotten lost in the kitchen.</p>
            <Link
                to="/"
                className="mt-8 inline-block px-6 py-3 text-white font-semibold bg-primary rounded-full hover:bg-primary-dark transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
                Back to Home
            </Link>
        </motion.div>
    </div>
  );
};
export default NotFoundPage;