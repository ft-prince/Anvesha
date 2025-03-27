// components/stats/ScoreCard.jsx
import React from 'react';
import { motion } from 'framer-motion';

const ScoreCard = ({ score, label, color, textColor }) => {
  return (
    <motion.div 
      className={`${color} rounded-lg p-4 shadow-md flex flex-col items-center justify-center`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      whileHover={{ y: -5, transition: { duration: 0.2 } }}
    >
      <motion.span 
        className={`text-3xl font-bold ${textColor || 'text-gray-800'} mb-1`}
        initial={{ scale: 0.8 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
      >
        {score}
      </motion.span>
      <span className="text-sm font-medium text-gray-700">{label}</span>
    </motion.div>
  );
};

export default ScoreCard;