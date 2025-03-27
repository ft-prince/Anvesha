// components/verification/VerificationTabs.jsx
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import SimpleVerification from './SimpleVerification';
import VoiceVerification from './VoiceVerification';

const VerificationTabs = ({ onSubmit }) => {
  const [activeTab, setActiveTab] = useState('document');
  
  return (
    <div className="bg-white/80 backdrop-blur-sm p-6 rounded-lg shadow-lg mb-8">
      <h2 className="text-2xl font-bold mb-4 text-indigo-900">Additional Verification Methods</h2>
      
      {/* Tab Navigation */}
      <div className="flex mb-6 border-b border-gray-200">
        <button 
          className={`px-4 py-2 font-medium ${activeTab === 'document' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-500 hover:text-gray-700'}`}
          onClick={() => setActiveTab('document')}
        >
          Document Upload
        </button>
        <button 
          className={`px-4 py-2 font-medium ${activeTab === 'voice' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-500 hover:text-gray-700'}`}
          onClick={() => setActiveTab('voice')}
        >
          Voice Transcription
        </button>
      </div>
      
      {/* Tab Content */}
      <AnimatePresence mode="wait">
        {activeTab === 'document' && (
          <motion.div
            key="document-tab"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <SimpleVerification onSubmit={onSubmit} />
          </motion.div>
        )}
        
        {activeTab === 'voice' && (
          <motion.div
            key="voice-tab"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <VoiceVerification onSubmit={onSubmit} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default VerificationTabs;