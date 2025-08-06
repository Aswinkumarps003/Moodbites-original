import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import DishCard from '../../components/DishCard';
import { fetchDishes } from '../../services/foodApi';
import Spinner from '../../components/common/Spinner';
import PageAnimator from '../../components/common/PageAnimator';
import AuroraBackground from '../../components/common/AuroraBackground';
import ThreeDBackground from '../../components/common/ThreeDBackground';
import { useState, useEffect } from 'react';
import { FaArrowRight } from 'react-icons/fa';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/effect-coverflow';
import { EffectCoverflow, Autoplay, Pagination } from 'swiper/modules';
import pizzaImg from '../../assets/images/pizza1.png';
import chocoImg from '../../assets/images/choco1.png';
import bbqImg from '../../assets/images/BBQ1.png';
import saladImg from '../../assets/images/salad1.png';

const heroTextContainer = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const heroTextItem = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
    },
  },
};

const featuredDishes = [
  {
    id: 1,
    name: 'Margherita Pizza',
    image: pizzaImg,
    description: 'Classic pizza with mozzarella, tomatoes, and basil.'
  },
  {
    id: 2,
    name: 'Sushi Platter',
    image: chocoImg,
    description: 'Assorted fresh nigiri and maki rolls.'
  },
  {
    id: 3,
    name: 'Carne Asada Tacos',
    image: saladImg,
    description: 'Grilled steak tacos with cilantro and lime.'
  },
];

const HomePage = () => {
  const [dishes, setDishes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const data = await fetchDishes();
        setDishes(data);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 30000); // Fetch every 30 seconds
    return () => clearInterval(interval);
  }, []);

  if (loading && dishes.length === 0) {
    return <Spinner />;
  }

  if (error) {
    return <div className="text-center py-24 text-red-500">{error.message}</div>;
  }

  if (dishes.length === 0) {
    return <div className="text-center py-24">No dishes found.</div>;
  }

  return (
    <PageAnimator>
      <div className="relative min-h-[90vh] pb-24 overflow-hidden">
        {/* Floating 3D food images */}
        <img src={pizzaImg} alt="Pizza" className="absolute left-10 top-24 w-32 h-32 object-contain drop-shadow-2xl animate-blob-1 z-1 opacity-80" style={{filter:'drop-shadow(0 8px 32px orange)'}}/>
        <img src={chocoImg} alt="Sushi" className="absolute right-16 top-40 w-28 h-28 object-contain drop-shadow-2xl animate-blob-2 z-1 opacity-80" style={{filter:'drop-shadow(0 8px 32px #fbbf24)'}}/>
        <img src={saladImg} alt="Tacos" className="absolute left-1/2 top-10 w-24 h-24 object-contain drop-shadow-2xl animate-blob-1 z-1 opacity-80" style={{filter:'drop-shadow(0 8px 32px #f59e42)'}}/>
        <img src={bbqImg} alt="BBQ" className="absolute top-90 left-90 w-24 h-24 object-contain drop-shadow-2xl animate-blob-1 z-1 opacity-80" style={{filter:'drop-shadow(0 8px 32px #f59e42)'}}/>
          {/* <ThreeDBackground /> */}
        <AuroraBackground />
        <section className="text-center py-24 md:py-32 relative">
          <div className="absolute inset-0 w-screen h-screen bg-gradient-to-br from-orange-100/60 via-pink-100/40 to-yellow-100/60 blur-2xl opacity-70 animate-pulse-slow z-0" />
          <motion.div variants={heroTextContainer} initial="hidden" animate="visible" className="relative z-10">
            <motion.p variants={heroTextItem} className="font-semibold text-primary mb-2 drop-shadow-lg">YOUR NEXT FAVORITE MEAL AWAITS</motion.p>
            <motion.h1 variants={heroTextItem} className="text-4xl md:text-6xl font-extrabold text-text-primary tracking-tighter mb-6 drop-shadow-xl">
              <span className="bg-gradient-to-r from-orange-500 via-pink-500 to-yellow-400 bg-clip-text text-transparent animate-gradient-x">Discover a World of Flavor</span>
            </motion.h1>
            <motion.p variants={heroTextItem} className="text-lg text-text-secondary max-w-2xl mx-auto mb-10">Stop wondering what to eat. Get instant, personalized dish recommendations.</motion.p>
            <motion.div variants={heroTextItem}>
              <Link to="/recommendations" className="group relative inline-flex items-center justify-center px-8 py-4 text-lg font-bold text-white bg-gradient-to-r from-orange-500 to-orange-600 rounded-full overflow-hidden transition-all duration-300 transform hover:scale-105 shadow-xl hover:shadow-lg hover:shadow-primary/40 border-4 border-white/30 animate-glow">
                <span className="absolute top-0 left-0 w-0 h-full transition-all duration-300 ease-out bg-white/20 group-hover:w-full"></span>
                <span className="relative flex items-center">Get Started <FaArrowRight className="ml-2 transition-transform group-hover:translate-x-1" /></span>
              </Link>
            </motion.div>
          </motion.div>
        </section>
        {/* Swiper Carousel */}
        <div className="max-w-3xl mx-auto mb-16 relative z-20">
          <Swiper
            effect="coverflow"
            grabCursor={true}
            centeredSlides={true}
            slidesPerView={1.2}
            coverflowEffect={{ rotate: 30, stretch: 0, depth: 120, modifier: 1, slideShadows: true }}
            autoplay={{ delay: 3500, disableOnInteraction: false }}
            pagination={{ clickable: true }}
            modules={[EffectCoverflow, Autoplay, Pagination]}
            className="food-swiper"
            style={{paddingBottom: '3rem'}}
          >
            {featuredDishes.map((dish) => (
              <SwiperSlide key={dish.id}>
                <div className="bg-white/80 rounded-3xl shadow-2xl p-6 flex flex-col items-center justify-center border border-white/30">
                  <img src={dish.image} alt={dish.name} className="w-40 h-40 object-cover rounded-2xl mb-4 shadow-lg" />
                  <h3 className="text-2xl font-bold mb-2 text-gray-800">{dish.name}</h3>
                  <p className="text-gray-600 text-base">{dish.description}</p>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
        {/* Food Cards Grid */}
        <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 px-4 z-20 relative">
          {(dishes.length > 0 ? dishes : featuredDishes).map((dish) => (
            <DishCard key={dish.id} dish={dish} />
          ))}
        </div>
      </div>
    </PageAnimator>
  );
};

export default HomePage; 