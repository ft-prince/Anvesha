import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';

const TextToSpeech = ({ text }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);
  
  const apiBaseUrl = import.meta.env?.VITE_TTS;
  
  const handleTextToSpeech = async () => {
    if (!text || text.trim() === '') return;
    
    // If already playing, pause it
    if (isPlaying && audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setIsPlaying(false);
      return;
    }
    
    // If we already have audio loaded, just play it
    if (audioRef.current?.src && !isPlaying) {
      audioRef.current.play();
      setIsPlaying(true);
      return;
    }
    
    // Otherwise, fetch new audio
    setIsLoading(true);
    try {
      const response = await axios.post(`${apiBaseUrl}/api/speech/synthesize`, {
        text: text,
        language: 'en-IN', // Using Indian English
        slow: false,
      });
      
      if (response.data && response.data.audio_base64) {
        // Create audio element with base64 audio
        const audio = `data:${response.data.format};base64,${response.data.audio_base64}`;
        
        if (!audioRef.current) {
          audioRef.current = new Audio(audio);
        } else {
          audioRef.current.src = audio;
        }
        
        audioRef.current.onended = () => {
          setIsPlaying(false);
        };
        
        audioRef.current.play();
        setIsPlaying(true);
      }
    } catch (error) {
      console.error('Error synthesizing speech:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <motion.button
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      onClick={handleTextToSpeech}
      disabled={!text || text.trim() === ''}
      className="flex items-center justify-center rounded-full w-10 h-10 bg-indigo-100 hover:bg-indigo-200 text-indigo-700 disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed"
      title="Listen to response"
    >
      {isLoading ? (
        <motion.div 
          className="w-5 h-5 border-2 border-indigo-700 border-t-transparent rounded-full"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        ></motion.div>
      ) : isPlaying ? (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="6" y="5" width="4" height="14" rx="1" fill="currentColor" />
          <rect x="14" y="5" width="4" height="14" rx="1" fill="currentColor" />
        </svg>
      ) : (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M15.5 12L9.5 7V17L15.5 12Z" fill="currentColor" />
          <path d="M18 12C18 15.3137 15.3137 18 12 18C8.68629 18 6 15.3137 6 12C6 8.68629 8.68629 6 12 6C15.3137 6 18 8.68629 18 12Z" stroke="currentColor" strokeWidth="2" />
        </svg>
      )}
    </motion.button>
  );
};

export default TextToSpeech;