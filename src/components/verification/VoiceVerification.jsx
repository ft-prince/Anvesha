// components/verification/VoiceVerification.jsx
import React, { useState } from 'react';
import { motion } from 'framer-motion';

const VoiceVerification = ({ onSubmit }) => {
  const [voiceText, setVoiceText] = useState('');
  
  const handleSubmit = () => {
    if (!voiceText.trim()) return;
    
    onSubmit({
      type: 'voice',
      text: voiceText
    });
    
    // Reset
    setVoiceText('');
  };
  
  return (
    <div className="bg-white p-6 rounded-lg shadow-md mb-8">
      <h2 className="text-2xl font-bold mb-4 text-indigo-900">Voice Transcription</h2>
      
      <div className="mb-4">
        <p className="text-gray-600 mb-2">
          Transcribe your voice message here for fact-checking:
        </p>
        <textarea
          value={voiceText}
          onChange={(e) => setVoiceText(e.target.value)}
          placeholder="Type what you said or heard here..."
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          rows={4}
        />
      </div>
      
      <motion.button
        whileTap={{ scale: 0.95 }}
        onClick={handleSubmit}
        disabled={!voiceText.trim()}
        className={`w-full py-3 rounded-lg ${voiceText.trim() ? 'bg-indigo-600 hover:bg-indigo-700 text-white' : 'bg-gray-200 text-gray-500 cursor-not-allowed'}`}
      >
        Submit Transcription
      </motion.button>
      
      <div className="mt-6 p-3 bg-indigo-50 rounded-lg">
        <p className="text-sm text-indigo-800">
          <span className="font-semibold">Tip:</span> For more accurate results, include specific quotes, dates and names.
        </p>
      </div>
    </div>
  );
};

export default VoiceVerification;