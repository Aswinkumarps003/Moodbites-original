import { motion } from 'framer-motion';
import PageAnimator from '../../components/common/PageAnimator';
import AuroraBackground from '../../components/common/AuroraBackground';
import { LuUsers, LuLightbulb, LuHeart } from "react-icons/lu";

const AboutPage = () => {
  const featureVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };
  return (
    <PageAnimator>
      <div className="relative min-h-[80vh] py-24 text-center overflow-hidden">
        <AuroraBackground />
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tighter">About MoodBites</h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto mt-4">We believe finding your next meal should be an exciting adventure, not a daily chore. Our mission is to connect people with food they love through smart, personalized technology.</p>
        </motion.div>

        <motion.div className="mt-20 grid md:grid-cols-3 gap-12 max-w-5xl mx-auto"
          initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.3 }}
          variants={{ visible: { transition: { staggerChildren: 0.2 } } }}
        >
          <motion.div variants={featureVariants} className="p-8 bg-white/60 backdrop-blur-lg rounded-2xl shadow-xl border border-white/20">
            <LuUsers className="text-5xl text-primary mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-800">For Food Lovers</h3>
            <p className="text-gray-600 mt-2">Built by a team of passionate foodies who understand the joy of a perfect meal.</p>
          </motion.div>
          <motion.div variants={featureVariants} className="p-8 bg-white/60 backdrop-blur-lg rounded-2xl shadow-xl border border-white/20">
            <LuLightbulb className="text-5xl text-primary mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-800">Smart Technology</h3>
            <p className="text-gray-600 mt-2">Our recommendation engine learns from your tastes to provide truly personal suggestions.</p>
          </motion.div>
          <motion.div variants={featureVariants} className="p-8 bg-white/60 backdrop-blur-lg rounded-2xl shadow-xl border border-white/20">
            <LuHeart className="text-5xl text-primary mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-800">Community Focused</h3>
            <p className="text-gray-600 mt-2">Discover what's popular, share your favorites, and join a community of flavor explorers.</p>
          </motion.div>
        </motion.div>
      </div>
    </PageAnimator>
  );
};
export default AboutPage;