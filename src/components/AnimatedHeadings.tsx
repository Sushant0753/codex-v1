"use client";

import { motion } from "framer-motion";

interface AnimatedHeadingProps {
  title: string;
  subtitle?: string;
  gradient?: string; 
  duration?: number; 
}

const AnimatedHeading: React.FC<AnimatedHeadingProps> = ({
  title,
  subtitle,
  gradient = "from-blue-500 to-purple-600 dark:from-blue-400 dark:to-purple-500",
  duration = 0.6,
}) => {
  return (
    <motion.div
      className="mb-12 text-center"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration }}
    >
      <h2 className={`text-4xl font-bold mb-3 bg-clip-text text-transparent bg-gradient-to-r ${gradient}`}>
        {title}
      </h2>
      {subtitle && <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">{subtitle}</p>}
    </motion.div>
  );
};

export default AnimatedHeading;
