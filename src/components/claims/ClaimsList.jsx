import React from 'react';
import ClaimCard from './ClaimCard';

const ClaimsList = ({ claims }) => {
  return (
    <div className="space-y-4">
      {claims?.map((claim, index) => (
        <ClaimCard key={index} claim={claim} index={index} />
      ))}
    </div>
  );
};

export default ClaimsList;