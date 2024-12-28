export const getRatingColor = (rating) => {
  const lowerRating = rating.toLowerCase();
  if (lowerRating.includes('true')) return 'bg-green-100';
  if (lowerRating.includes('false')) return 'bg-red-100';
  if (lowerRating.includes('mixed')) return 'bg-yellow-100';
  return 'bg-gray-100';
};

export const filterClaims = (claims, filters) => {
  if (!claims) return [];
  
  return claims.filter(claim => {
    const matchesSearch = claim.text.toLowerCase().includes(filters.searchTerm.toLowerCase());
    const matchesRating = filters.rating === 'all' || 
      claim.claimReview?.[0]?.textualRating.toLowerCase().includes(filters.rating);
    return matchesSearch && matchesRating;
  });
};