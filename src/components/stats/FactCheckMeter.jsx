// components/stats/FactCheckMeter.jsx
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const FactCheckMeter = ({ claims }) => {
  const [stats, setStats] = useState({
    true: 0,
    false: 0,
    halfTrue: 0,
    total: 0
  });

  useEffect(() => {
    if (!claims || claims.length === 0) {
      setStats({ true: 0, false: 0, halfTrue: 0, total: 0 });
      return;
    }

    const newStats = claims.reduce((acc, claim) => {
      const rating = claim.claimReview?.[0]?.textualRating?.toLowerCase() || '';
      
      if (rating.includes('true') && !rating.includes('half') && !rating.includes('mostly')) {
        acc.true += 1;
      } else if (rating.includes('false')) {
        acc.false += 1;
      } else if (rating.includes('half') || rating.includes('mixed') || rating.includes('mostly')) {
        acc.halfTrue += 1;
      }
      
      acc.total += 1;
      return acc;
    }, { true: 0, false: 0, halfTrue: 0, total: 0 });

    setStats(newStats);
  }, [claims]);

  const calculatePercentage = (value) => {
    return stats.total > 0 ? Math.round((value / stats.total) * 100) : 0;
  };

  const truePercent = calculatePercentage(stats.true);
  const falsePercent = calculatePercentage(stats.false);
  const halfTruePercent = calculatePercentage(stats.halfTrue);

  return (
    <div className="bg-white/90 rounded-lg p-6 shadow-md">
      <h3 className="text-xl font-semibold text-indigo-900 mb-4">Fact Check Meter</h3>
      
      <div className="flex items-center mb-6">
        <div className="w-full bg-gray-200 rounded-full h-8 overflow-hidden">
          <div className="flex h-full">
            <motion.div 
              initial={{ width: 0 }} 
              animate={{ width: `${truePercent}%` }}
              transition={{ duration: 1, delay: 0.2 }}
              className="bg-green-500 h-full flex items-center justify-center text-xs font-medium text-white"
              style={{ width: `${truePercent}%` }}
            >
              {truePercent > 10 && `${truePercent}%`}
            </motion.div>
            <motion.div 
              initial={{ width: 0 }} 
              animate={{ width: `${halfTruePercent}%` }}
              transition={{ duration: 1, delay: 0.4 }}
              className="bg-yellow-500 h-full flex items-center justify-center text-xs font-medium text-white"
              style={{ width: `${halfTruePercent}%` }}
            >
              {halfTruePercent > 10 && `${halfTruePercent}%`}
            </motion.div>
            <motion.div 
              initial={{ width: 0 }} 
              animate={{ width: `${falsePercent}%` }}
              transition={{ duration: 1, delay: 0.6 }}
              className="bg-red-500 h-full flex items-center justify-center text-xs font-medium text-white"
              style={{ width: `${falsePercent}%` }}
            >
              {falsePercent > 10 && `${falsePercent}%`}
            </motion.div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="text-center">
          <div className="flex items-center justify-center">
            <div className="w-4 h-4 bg-indigo-500 rounded-full mr-2"></div>
            <span className="text-sm font-medium text-gray-700">Total Claims</span>
          </div>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="text-2xl font-bold text-indigo-600"
          >
            {stats.total}
          </motion.p>
        </div>
        
        <div className="text-center">
          <div className="flex items-center justify-center">
            <div className="w-4 h-4 bg-green-500 rounded-full mr-2"></div>
            <span className="text-sm font-medium text-gray-700">True</span>
          </div>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="text-2xl font-bold text-green-600"
          >
            {stats.true}
            <span className="text-sm ml-1 text-gray-500">
              ({truePercent}%)
            </span>
          </motion.p>
        </div>
        
        <div className="text-center">
          <div className="flex items-center justify-center">
            <div className="w-4 h-4 bg-yellow-500 rounded-full mr-2"></div>
            <span className="text-sm font-medium text-gray-700">Half True</span>
          </div>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="text-2xl font-bold text-yellow-600"
          >
            {stats.halfTrue}
            <span className="text-sm ml-1 text-gray-500">
              ({halfTruePercent}%)
            </span>
          </motion.p>
        </div>
        
        <div className="text-center">
          <div className="flex items-center justify-center">
            <div className="w-4 h-4 bg-red-500 rounded-full mr-2"></div>
            <span className="text-sm font-medium text-gray-700">False</span>
          </div>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9 }}
            className="text-2xl font-bold text-red-600"
          >
            {stats.false}
            <span className="text-sm ml-1 text-gray-500">
              ({falsePercent}%)
            </span>
          </motion.p>
        </div>
      </div>


    </div>
  );
};

export default FactCheckMeter;