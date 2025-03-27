// components/stats/StatsSection.jsx
import React from 'react';
import ScoreCard from './ScoreCard';

const StatsSection = ({ claims }) => {
  const trueClaims = claims?.filter(c => 
    c.claimReview?.[0]?.textualRating?.toLowerCase().includes('true') && 
    !c.claimReview?.[0]?.textualRating?.toLowerCase().includes('half') &&
    !c.claimReview?.[0]?.textualRating?.toLowerCase().includes('mostly')
  ).length || 0;

  const halfTrueClaims = claims?.filter(c => 
    (c.claimReview?.[0]?.textualRating?.toLowerCase().includes('half') ||
     c.claimReview?.[0]?.textualRating?.toLowerCase().includes('mixed') ||
     c.claimReview?.[0]?.textualRating?.toLowerCase().includes('mostly'))
  ).length || 0;

  const falseClaims = claims?.filter(c => 
    c.claimReview?.[0]?.textualRating?.toLowerCase().includes('false')
  ).length || 0;

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
      <ScoreCard
        score={claims?.length || 0}
        label="Total Claims"
        color="bg-indigo-100"
        textColor="text-indigo-800"
      />
      <ScoreCard
        score={trueClaims}
        label="True Claims"
        color="bg-green-100"
        textColor="text-green-800"
      />
      <ScoreCard
        score={halfTrueClaims}
        label="Half True"
        color="bg-yellow-100"
        textColor="text-yellow-800"
      />
      <ScoreCard
        score={falseClaims}
        label="False Claims"
        color="bg-red-100"
        textColor="text-red-800"
      />
    </div>
  );
};

export default StatsSection;