import React, { useState } from 'react';
import { motion } from 'framer-motion';
// No need for external icon library

const ClaimCard = ({ claim }) => {
  const [expanded, setExpanded] = useState(false);
  
  const getRatingColor = (rating) => {
    const ratingText = rating?.toLowerCase() || '';
    
    if (ratingText.includes('true') && !ratingText.includes('half') && !ratingText.includes('mostly')) {
      return 'bg-green-100 text-green-800 border-green-200';
    } else if (ratingText.includes('false')) {
      return 'bg-red-100 text-red-800 border-red-200';
    } else if (ratingText.includes('half') || ratingText.includes('mixed') || ratingText.includes('mostly')) {
      return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    }
    
    return 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const getSourceLogo = (url) => {
    try {
      const hostname = new URL(url).hostname;
      return `https://www.google.com/s2/favicons?domain=${hostname}&sz=32`;
    } catch (e) {
      return null;
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;
    
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(date);
  };

  const claimReview = claim.claimReview?.[0] || {};
  const rating = claimReview.textualRating || 'Unrated';
  const ratingColor = getRatingColor(rating);
  const sourceLogo = getSourceLogo(claimReview.url);
  const publishDate = formatDate(claimReview.reviewDate);

  return (
    <motion.div
      className="border border-indigo-100 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow bg-white"
      whileHover={{ y: -2 }}
    >
      <div className="p-4">
        <div className="flex flex-wrap items-start justify-between mb-3">
          <div className="mb-2">
            <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${ratingColor} border`}>
              {rating}
            </span>
          </div>
          {publishDate && (
            <span className="text-sm text-gray-500">
              {publishDate}
            </span>
          )}
        </div>
        
        <h3 className="text-lg font-semibold text-gray-800 mb-2">
          {claim.text}
        </h3>
        
        <div className="flex items-center mb-3">
          {sourceLogo && (
            <img 
              src={sourceLogo} 
              alt="Source" 
              className="h-5 w-5 mr-2"
              onError={(e) => {e.target.style.display = 'none'}}
            />
          )}
          <span className="text-sm text-indigo-600 font-medium">
            {claimReview.publisher?.name || 'Unknown Source'}
          </span>
        </div>
        
        <button
          onClick={() => setExpanded(!expanded)}
          className="flex items-center text-indigo-600 hover:text-indigo-800 text-sm font-medium transition-colors"
        >
          {expanded ? (
            <>
              ▲ Show less
            </>
          ) : (
            <>
              ▼ Show details
            </>
          )}
        </button>
      </div>
      
      {expanded && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="px-4 pb-4"
        >
          {claimReview.title && (
            <div className="mb-3">
              <h4 className="text-sm font-medium text-gray-700 mb-1">Claim Review</h4>
              <p className="text-gray-800">{claimReview.title}</p>
            </div>
          )}
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            {claim.claimDate && (
              <div>
                <h4 className="text-xs font-medium text-gray-500 mb-1">Claim Date</h4>
                <p className="text-sm">{formatDate(claim.claimDate)}</p>
              </div>
            )}
            
            {claimReview.url && (
              <div className="md:text-right">
                <a
                  href={claimReview.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-sm bg-indigo-50 hover:bg-indigo-100 text-indigo-700 px-3 py-1 rounded transition-colors"
                >
                  🔗 View Full Fact Check
                </a>
              </div>
            )}
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default ClaimCard;
