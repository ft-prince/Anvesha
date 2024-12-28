import React from 'react';
import { motion } from 'framer-motion';

const ScoreCard = ({ score, label, color }) => {
  return (
    <motion.div
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ 
        type: "spring",
        stiffness: 200,
        damping: 20
      }}
      whileHover={{ 
        scale: 1.05,
        transition: { duration: 0.2 }
      }}
      className={`p-4 rounded-lg shadow-lg ${color} cursor-pointer`}
    >
      <motion.h3 
        className="text-xl font-bold"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        {label}
      </motion.h3>
      <motion.div 
        className="text-3xl font-bold mt-2"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.4 }}
      >
        {score}
      </motion.div>
    </motion.div>
  );
};

export default ScoreCard;