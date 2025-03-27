// components/claims/ClaimsList.jsx
import React from 'react';
import { motion } from 'framer-motion';
import ClaimCard from './ClaimCard';

const ClaimsList = ({ claims }) => {
  if (!claims || claims.length === 0) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.6 }}
      className="bg-white/80 backdrop-blur-sm p-6 rounded-lg shadow-lg mb-8"
    >
      <h2 className="text-2xl font-bold mb-6 text-indigo-900">Fact-Checked Claims ({claims.length})</h2>
      
      <div className="space-y-4">
        {claims.map((claim, index) => (
          <motion.div
            key={claim.id || index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 * index, duration: 0.5 }}
          >
            <ClaimCard claim={claim} />
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default ClaimsList;
