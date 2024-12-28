import React from 'react';
import { motion } from 'framer-motion';

const ScoreCard = ({ score, label, color }) => {
  return (
    <motion.div
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      className={`p-4 rounded-lg shadow-lg ${color}`}
    >
      <h3 className="text-xl font-bold">{label}</h3>
      <div className="text-3xl font-bold mt-2">{score}</div>
    </motion.div>
  );
};

export default ScoreCard;