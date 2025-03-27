// utils/ratingUtils.js

/**
 * Categorizes a claim's rating into standard categories
 * @param {string} rating - The original textual rating
 * @returns {string} - Standardized rating category
 */
export const categorizeRating = (rating) => {
  if (!rating) return 'unknown';
  
  const ratingLower = rating.toLowerCase();
  
  if (ratingLower.includes('true') && !ratingLower.includes('half') && !ratingLower.includes('mostly') && !ratingLower.includes('partly')) {
    return 'true';
  } 
  
  if (ratingLower.includes('false') && !ratingLower.includes('mostly') && !ratingLower.includes('partly')) {
    return 'false';
  }
  
  if (
    ratingLower.includes('half') || 
    ratingLower.includes('mixed') || 
    ratingLower.includes('mostly') || 
    ratingLower.includes('partly') ||
    ratingLower.includes('misleading')
  ) {
    return 'half-true';
  }
  
  return 'unknown';
};

/**
 * Gets color class based on rating category
 * @param {string} ratingCategory - The rating category
 * @returns {string} - Tailwind CSS color class
 */
export const getRatingColorClass = (ratingCategory) => {
  switch (ratingCategory) {
    case 'true':
      return 'text-green-600';
    case 'half-true':
      return 'text-yellow-600';
    case 'false':
      return 'text-red-600';
    default:
      return 'text-gray-600';
  }
};

/**
 * Gets background color class based on rating category
 * @param {string} ratingCategory - The rating category
 * @returns {string} - Tailwind CSS background color class
 */
export const getRatingBgClass = (ratingCategory) => {
  switch (ratingCategory) {
    case 'true':
      return 'bg-green-500';
    case 'half-true':
      return 'bg-yellow-500';
    case 'false':
      return 'bg-red-500';
    default:
      return 'bg-gray-500';
  }
};

/**
 * Filters claims based on provided filters
 * @param {Array} claims - Array of claim objects
 * @param {Object} filters - Filter criteria
 * @returns {Array} - Filtered claims
 */
export const filterClaims = (claims, filters) => {
  if (!claims) return [];
  
  return claims.filter(claim => {
    const matchesSearchTerm = !filters.searchTerm || 
      claim.text?.toLowerCase().includes(filters.searchTerm.toLowerCase());
    
    const claimRating = claim.claimReview?.[0]?.textualRating?.toLowerCase() || '';
    const ratingCategory = categorizeRating(claimRating);
    
    const matchesRating = filters.rating === 'all' || ratingCategory === filters.rating;
    
    return matchesSearchTerm && matchesRating;
  });
};

/**
 * Counts claims by rating category
 * @param {Array} claims - Array of claim objects
 * @returns {Object} - Counts by category
 */
export const countClaimsByRating = (claims) => {
  if (!claims || claims.length === 0) {
    return { true: 0, false: 0, halfTrue: 0, unknown: 0 };
  }
  
  return claims.reduce((acc, claim) => {
    const rating = claim.claimReview?.[0]?.textualRating;
    const category = categorizeRating(rating);
    
    switch (category) {
      case 'true':
        acc.true += 1;
        break;
      case 'false':
        acc.false += 1;
        break;
      case 'half-true':
        acc.halfTrue += 1;
        break;
      default:
        acc.unknown += 1;
    }
    
    return acc;
  }, { true: 0, false: 0, halfTrue: 0, unknown: 0 });
};