import React from 'react';
import { motion } from 'framer-motion';
import { getRatingColor } from '../../utils/ratingUtils';

const ClaimCard = ({ claim, index }) => {
  const rating = claim.claimReview?.[0]?.textualRating || 'Unrated';
  const ratingColor = getRatingColor(rating);

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ 
        delay: index * 0.1,
        type: "spring",
        stiffness: 100
      }}
      whileHover={{ 
        scale: 1.02,
        transition: { duration: 0.2 }
      }}
      className="bg-white p-6 rounded-lg shadow-md cursor-pointer"
    >
      <h3 className="text-xl font-semibold mb-2">{claim.text}</h3>
      <motion.div 
        className="flex items-center gap-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: (index * 0.1) + 0.2 }}
      >
        <span className="font-bold">Rating:</span>
        <motion.span 
          className={`px-2 py-1 rounded ${ratingColor}`}
          whileHover={{ scale: 1.1 }}
        >
          {rating}
        </motion.span>
      </motion.div>
      {claim.claimReview?.[0]?.url && (
        <motion.a 
          href={claim.claimReview[0].url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 hover:underline mt-2 block"
          whileHover={{ x: 5 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          View Source →
        </motion.a>
      )}
    </motion.div>
  );
};

export default ClaimCard;