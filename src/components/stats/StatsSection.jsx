import React from 'react';
import ScoreCard from './ScoreCard';

const StatsSection = ({ claims }) => {
  const trueClaims = claims?.filter(c => 
    c.claimReview?.[0]?.textualRating.toLowerCase().includes('true')
  ).length || 0;

  const falseClaims = claims?.filter(c => 
    c.claimReview?.[0]?.textualRating.toLowerCase().includes('false')
  ).length || 0;

  return (
    <div className="grid grid-cols-3 gap-4 mb-8">
      <ScoreCard
        score={claims?.length || 0}
        label="Total Claims"
        color="bg-blue-100"
      />
      <ScoreCard
        score={trueClaims}
        label="True Claims"
        color="bg-green-100"
      />
      <ScoreCard
        score={falseClaims}
        label="False Claims"
        color="bg-red-100"
      />
    </div>
  );
};

export default StatsSection;