// components/verification/VoiceVerificationComponent.jsx
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { VoiceRecordingService, formatRecordingTime } from '../../services/voiceService';

const VoiceVerificationComponent = ({ onSubmit }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [recordingError, setRecordingError] = useState(null);
  const [transcription, setTranscription] = useState(null);
  const [audioUrl, setAudioUrl] = useState(null);
  
  const voiceServiceRef = useRef(null);
  
  // Initialize the voice service
  useEffect(() => {
    voiceServiceRef.current = new VoiceRecordingService();
    
    // Set up status change handler
    voiceServiceRef.current.onStatusChange = (recording, time) => {
      setIsRecording(recording);
      if (time !== undefined) {
        setRecordingTime(time);
      }
    };
    
    // Set up transcription handler
    voiceServiceRef.current.onTranscriptReady = (result) => {
      setTranscription(result.text);
      setAudioUrl(result.audioUrl);
    };
    
    // Cleanup on unmount
    return () => {
      if (voiceServiceRef.current && isRecording) {
        voiceServiceRef.current.stopRecording();
      }
    };
  }, []);
  
  // Start recording
  const startRecording = async () => {
    try {
      setRecordingError(null);
      await voiceServiceRef.current.startRecording();
    } catch (error) {
      setRecordingError(error.message || "Could not access microphone");
      console.error("Recording error:", error);
    }
  };
  
  // Stop recording
  const stopRecording = () => {
    if (voiceServiceRef.current) {
      voiceServiceRef.current.stopRecording();
    }
  };
  
  // Submit transcription for fact-checking
  const handleSubmit = () => {
    if (transcription) {
      onSubmit({
        type: 'voice',
        text: transcription,
        duration: recordingTime
      });
    }
  };
  
  // Reset the recording
  const handleReset = () => {
    setTranscription(null);
    setAudioUrl(null);
    setRecordingTime(0);
  };
  
  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <h3 className="text-xl font-semibold text-indigo-900 mb-4">Voice Fact-Checking</h3>
      
      {recordingError && (
        <div className="mb-4 p-3 bg-red-100 border border-red-300 text-red-800 rounded-lg">
          <p>{recordingError}</p>
          <p className="text-sm mt-1">Try using Chrome or Firefox, or check your browser permissions.</p>
        </div>
      )}
      
      <div className="bg-indigo-50 p-4 rounded-lg mb-4">
        <p className="text-indigo-800 text-sm mb-2">
          Speak your question or claim to fact-check it. For best results:
        </p>
        <ul className="text-sm text-indigo-700 list-disc pl-5 space-y-1">
          <li>Speak clearly and at a normal pace</li>
          <li>Include specific dates, names, and statistics if relevant</li>
          <li>Keep your question focused on a single topic</li>
          <li>Recordings are limited to 60 seconds</li>
        </ul>
      </div>
      
      <AnimatePresence mode="wait">
        {isRecording ? (
          // Recording in progress state
          <motion.div
            key="recording"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center p-6 bg-white border border-red-200 rounded-lg"
          >
            <div className="flex items-center mb-4">
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ repeat: Infinity, duration: 1.5 }}
                className="w-4 h-4 bg-red-600 rounded-full mr-2"
              />
              <span className="text-lg font-medium text-red-600">
                Recording... {formatRecordingTime(recordingTime)}
              </span>
            </div>
            
            <motion.div 
              className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mb-4 cursor-pointer"
              whileTap={{ scale: 0.95 }}
              onClick={stopRecording}
            >
              <div className="w-10 h-10 bg-red-600 rounded"></div>
            </motion.div>
            
            <button
              onClick={stopRecording}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
            >
              Stop Recording
            </button>
          </motion.div>
        ) : transcription ? (
          // Transcription complete state
          <motion.div
            key="transcription"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="p-4 bg-white border border-indigo-200 rounded-lg"
          >
            <div className="mb-4">
              <h4 className="text-lg font-medium text-indigo-800 mb-2">Transcription:</h4>
              <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg">
                <p className="text-gray-800">{transcription}</p>
              </div>
            </div>
            
            {audioUrl && (
              <div className="mb-4">
                <h4 className="text-sm font-medium text-gray-700 mb-1">Recording:</h4>
                <audio src={audioUrl} controls className="w-full"></audio>
              </div>
            )}
            
            <div className="flex flex-wrap gap-2">
              <button
                onClick={handleReset}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300"
              >
                Record Again
              </button>
              
              <button
                onClick={handleSubmit}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
              >
                Fact-Check This
              </button>
            </div>
          </motion.div>
        ) : (
          // Ready to record state
          <motion.div
            key="ready"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center p-6"
          >
            <p className="text-gray-600 mb-4 text-center">
              Tap the microphone to start recording your question
            </p>
            
            <motion.div 
              className="w-24 h-24 bg-indigo-100 rounded-full flex items-center justify-center cursor-pointer"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={startRecording}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-indigo-600">
                <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"></path>
                <path d="M19 10v2a7 7 0 0 1-14 0v-2"></path>
                <line x1="12" y1="19" x2="12" y2="23"></line>
                <line x1="8" y1="23" x2="16" y2="23"></line>
              </svg>
            </motion.div>
            
            <button
              onClick={startRecording}
              className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
            >
              Start Recording
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default VoiceVerificationComponent;