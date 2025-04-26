import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import TextToSpeech from './TextToSpeech';

const AgentResponse = ({ response, verdict, isLoading, sources = [], confidence = null }) => {
  const [showDetails, setShowDetails] = useState(false);
  
  // Helper function to get color based on verdict
  const getVerdictColor = (verdict) => {
    switch (verdict?.toUpperCase()) {
      case 'TRUE':
        return 'bg-green-500';
      case 'FALSE':
        return 'bg-red-500';
      case 'MISLEADING':
        return 'bg-yellow-500';
      case 'UNVERIFIED':
        return 'bg-gray-500';
      default:
        return 'bg-blue-500';
    }
  };

  // Helper function to get text color based on verdict
  const getVerdictTextColor = (verdict) => {
    switch (verdict?.toUpperCase()) {
      case 'TRUE':
        return 'text-green-700';
      case 'FALSE':
        return 'text-red-700';
      case 'MISLEADING':
        return 'text-yellow-700';
      case 'UNVERIFIED':
        return 'text-gray-700';
      default:
        return 'text-blue-700';
    }
  };

  // Helper function to get emoji based on verdict
  const getVerdictEmoji = (verdict) => {
    switch (verdict?.toUpperCase()) {
      case 'TRUE':
        return '✅';
      case 'FALSE':
        return '❌';
      case 'MISLEADING':
        return '⚠️';
      case 'UNVERIFIED':
        return '❓';
      default:
        return '🔍';
    }
  };

  // Helper function to get confidence bar color
  const getConfidenceColor = (confidence) => {
    if (!confidence) return 'bg-gray-500';
    
    const confidenceLower = confidence.toLowerCase();
    if (confidenceLower.includes('high')) {
      return 'bg-green-500';
    } else if (confidenceLower.includes('medium')) {
      return 'bg-yellow-500';
    } else if (confidenceLower.includes('low')) {
      return 'bg-red-500';
    } else {
      return 'bg-gray-500';
    }
  };

  // Extract URLs from text
  const extractUrls = (text) => {
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    return text.match(urlRegex) || [];
  };

  // Clean the source data
  const cleanSources = () => {
    if (!sources || !Array.isArray(sources) || sources.length === 0) {
      // If no sources provided as props, try to extract from response
      return extractUrls(response || '');
    }
    return sources;
  };

  const extractedSources = cleanSources();

  if (isLoading) {
    return (
      <motion.div 
        className="mb-8 bg-white/80 backdrop-blur-sm p-6 rounded-lg shadow-lg"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-2xl font-bold mb-4 text-indigo-900">Agent Analysis</h2>
        <div className="flex items-center justify-center py-8">
          <motion.div 
            className="w-10 h-10 border-4 border-indigo-200 border-t-indigo-600 rounded-full mr-3"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          ></motion.div>
          <span className="text-indigo-600">Our agent is analyzing your query...</span>
        </div>
      </motion.div>
    );
  }

  if (!response) {
    return null;
  }

  return (
    <motion.div 
      className="mb-8 bg-white/80 backdrop-blur-sm p-6 rounded-lg shadow-lg"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
        <div className="flex items-center">
          <h2 className="text-2xl font-bold text-indigo-900 mr-2">Agent Analysis</h2>
          {response && <TextToSpeech text={response} />}
        </div>
        {verdict && (
          <motion.div 
            className="flex items-center mt-2 md:mt-0"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className={`text-white font-bold px-4 py-2 rounded-lg ${getVerdictColor(verdict)} flex items-center`}>
              <span className="mr-2">{getVerdictEmoji(verdict)}</span>
              <span>{verdict.toUpperCase()}</span>
            </div>
          </motion.div>
        )}
      </div>
      
      {confidence && (
        <motion.div 
          className="mb-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <div className="flex justify-between items-center mb-1">
            <span className="text-sm font-medium text-gray-700">Confidence: {confidence}</span>
          </div>
          <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: "0%" }}
              animate={{ width: confidence.toLowerCase().includes('high') 
                ? '90%' 
                : confidence.toLowerCase().includes('medium') 
                  ? '60%' 
                  : '30%'
              }}
              transition={{ duration: 1, type: "spring" }}
              className={`h-full ${getConfidenceColor(confidence)}`}
            ></motion.div>
          </div>
        </motion.div>
      )}
      
      <motion.div 
        className="prose max-w-none mb-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <div className={`whitespace-pre-line text-gray-700 ${verdict ? getVerdictTextColor(verdict) : ''}`}>
          {response}
        </div>
      </motion.div>
      
      {extractedSources.length > 0 && (
        <>
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            onClick={() => setShowDetails(!showDetails)}
            className="flex items-center text-indigo-600 hover:text-indigo-800 font-medium mt-2 mb-2"
          >
            {showDetails ? 'Hide Sources' : 'Show Sources'} 
            <svg 
              className={`ml-1 w-5 h-5 transform transition-transform ${showDetails ? 'rotate-180' : ''}`} 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </motion.button>
          
          <AnimatePresence>
            {showDetails && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className="bg-indigo-50 p-4 rounded-lg mt-2">
                  <h3 className="font-medium text-indigo-900 mb-2">Sources & References</h3>
                  <ul className="space-y-2">
                    {extractedSources.map((source, index) => (
                      <li key={index} className="text-sm">
                        <a 
                          href={source} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-indigo-600 hover:text-indigo-800 hover:underline break-all"
                        >
                          {source}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </>
      )}
    </motion.div>
  );
};

export default AgentResponse;