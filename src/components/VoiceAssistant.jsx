import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';

const VoiceAssistant = () => {
  // State for the voice interaction
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [agentResponse, setAgentResponse] = useState('');
  const [agentVerdict, setAgentVerdict] = useState(null);
  const [recordingTime, setRecordingTime] = useState(0);
  const [showTranscript, setShowTranscript] = useState(true);
  const [error, setError] = useState(null);
  
  // Refs
  const mediaRecorderRef = useRef(null);
  const streamRef = useRef(null);
  const timerRef = useRef(null);
  const audioChunksRef = useRef([]);
  const audioRef = useRef(null);
  
  const apiBaseUrl = import.meta.env?.VITE_TTS;
  
  // Clean up on component unmount
  useEffect(() => {
    return () => {
      stopListening();
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      if (audioRef.current) {
        audioRef.current.pause();
      }
    };
  }, []);
  
  // Start listening function
  const startListening = async () => {
    try {
      // Reset states
      setTranscript('');
      setAgentResponse('');
      setAgentVerdict(null);
      setError(null);
      
      // Request microphone access
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      
      audioChunksRef.current = [];
      
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };
      
      mediaRecorder.onstop = () => {
        processAudio();
      };
      
      // Start the timer
      let seconds = 0;
      timerRef.current = setInterval(() => {
        seconds += 1;
        setRecordingTime(seconds);
      }, 1000);
      
      mediaRecorder.start();
      setIsListening(true);
    } catch (error) {
      console.error('Error starting listening:', error);
      setError('Could not access microphone. Please check your permissions.');
    }
  };
  
  // Stop listening function
  const stopListening = () => {
    if (mediaRecorderRef.current && isListening) {
      mediaRecorderRef.current.stop();
      
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
      
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      
      setIsListening(false);
    }
  };
  
  // Process the recorded audio (STT)
  const processAudio = async () => {
    if (audioChunksRef.current.length === 0) return;
    
    setIsProcessing(true);
    
    try {
      const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
      
      // Convert blob to base64
      const reader = new FileReader();
      reader.readAsDataURL(audioBlob);
      
      reader.onloadend = async () => {
        // Get base64 data without the prefix
        const base64Audio = reader.result.split(',')[1];
        
        const response = await axios.post(`${apiBaseUrl}/api/speech/recognize`, {
          audio_base64: base64Audio,
          language: 'en-IN', // Using Indian English
          energy_threshold: 300,
          dynamic_energy_threshold: true,
        });
        
        if (response.data && response.data.results && response.data.results.length > 0) {
          const transcriptText = response.data.results[0].transcript;
          setTranscript(transcriptText);
          
          // Call the fact-checking agent with the transcript
          if (transcriptText && transcriptText.trim()) {
            await fetchAgentResponse(transcriptText);
          } else {
            setIsProcessing(false);
            setError('Could not understand your question. Please try again.');
          }
        } else {
          setIsProcessing(false);
          setError('Could not understand your question. Please try again.');
        }
      };
    } catch (error) {
      console.error('Error processing audio:', error);
      setIsProcessing(false);
      setError('An error occurred while processing your speech. Please try again.');
    }
  };
  
  // Fetch response from fact-checker agent API
  const fetchAgentResponse = async (queryText) => {
    try {
      const response = await axios.post('/api/fact-check', {
        query: queryText
      });
      
      console.log('Agent API Response:', response.data);
      
      const resultText = response.data.result || 'Sorry, I could not find any information on that topic.';
      setAgentResponse(resultText);
      
      if (response.data.verdict) {
        setAgentVerdict(response.data.verdict);
      }
      
      // Speak the response
      speakResponse(resultText);
    } catch (err) {
      console.error('Error fetching agent response:', err);
      const errorMessage = 'Sorry, I could not process your request at this time. Please try again later.';
      setAgentResponse(errorMessage);
      speakResponse(errorMessage);
    } finally {
      setIsProcessing(false);
      setRecordingTime(0);
    }
  };
  
  // Text to speech function
  const speakResponse = async (text) => {
    if (!text || text.trim() === '') return;
    
    try {
      setIsSpeaking(true);
      
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
          setIsSpeaking(false);
        };
        
        audioRef.current.play();
      } else {
        setIsSpeaking(false);
      }
    } catch (error) {
      console.error('Error synthesizing speech:', error);
      setIsSpeaking(false);
    }
  };
  
  // Stop speaking
  const stopSpeaking = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setIsSpeaking(false);
    }
  };
  
  // Format time display
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };
  
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
  
  return (
    <div className="bg-white/80 backdrop-blur-sm p-6 rounded-lg shadow-lg">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-indigo-900 mb-2">Voice Assistant</h2>
        <p className="text-gray-600">Ask your question by voice and get an audio response</p>
      </div>
      
      <div className="flex justify-center mb-8">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={isListening ? stopListening : isSpeaking ? stopSpeaking : startListening}
          disabled={isProcessing}
          className={`rounded-full w-20 h-20 flex items-center justify-center text-white shadow-lg ${
            isListening ? 'bg-red-600' : isSpeaking ? 'bg-green-600' : 'bg-indigo-600'
          } disabled:bg-gray-400 disabled:cursor-not-allowed`}
        >
          {isProcessing ? (
            <motion.div 
              className="w-10 h-10 border-4 border-white border-t-transparent rounded-full"
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            ></motion.div>
          ) : isListening ? (
            <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="7" y="7" width="10" height="10" fill="currentColor" />
            </svg>
          ) : isSpeaking ? (
            <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="6" y="5" width="4" height="14" rx="1" fill="currentColor" />
              <rect x="14" y="5" width="4" height="14" rx="1" fill="currentColor" />
            </svg>
          ) : (
            <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 16C14.2091 16 16 14.2091 16 12V6C16 3.79086 14.2091 2 12 2C9.79086 2 8 3.79086 8 6V12C8 14.2091 9.79086 16 12 16Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M19 12C19 15.866 15.866 19 12 19C8.13401 19 5 15.866 5 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          )}
        </motion.button>
      </div>
      
      <div className="text-center mb-4">
        {isListening ? (
          <div className="flex justify-center items-center">
            <motion.div 
              className="w-3 h-3 bg-red-600 rounded-full mr-2"
              animate={{ opacity: [1, 0.5, 1] }}
              transition={{ duration: 1, repeat: Infinity }}
            ></motion.div>
            <span className="text-red-600 font-medium">Listening... {formatTime(recordingTime)}</span>
          </div>
        ) : isProcessing ? (
          <span className="text-indigo-600 font-medium">Processing your question...</span>
        ) : isSpeaking ? (
          <span className="text-green-600 font-medium">Speaking response...</span>
        ) : agentResponse ? (
          <span className="text-indigo-600 font-medium">
            Press the microphone to ask another question
          </span>
        ) : (
          <span className="text-gray-600">Press the microphone and ask your question</span>
        )}
      </div>
      
      {error && (
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-red-50 text-red-700 p-4 rounded-lg mb-4 text-center"
        >
          {error}
        </motion.div>
      )}
      
      <AnimatePresence>
        {(transcript || agentResponse) && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-indigo-50 rounded-lg p-4 overflow-hidden"
          >
            <div className="flex justify-between items-center mb-4">
              <span className="font-medium text-indigo-900">Conversation</span>
              <button 
                onClick={() => setShowTranscript(!showTranscript)}
                className="text-indigo-600 hover:text-indigo-800 text-sm flex items-center"
              >
                {showTranscript ? 'Hide' : 'Show'} conversation
                <svg 
                  className={`ml-1 w-4 h-4 transform transition-transform ${showTranscript ? 'rotate-180' : ''}`} 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
            </div>
            
            <AnimatePresence>
              {showTranscript && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                >
                  {transcript && (
                    <div className="mb-3">
                      <p className="text-sm text-gray-500 mb-1">You asked:</p>
                      <div className="bg-white p-3 rounded-lg shadow-sm text-gray-800">
                        {transcript}
                      </div>
                    </div>
                  )}
                  
                  {agentResponse && (
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <p className="text-sm text-gray-500">Anvesha's response:</p>
                        {agentVerdict && (
                          <div className={`text-white text-xs font-bold px-2 py-1 rounded ${getVerdictColor(agentVerdict)} flex items-center`}>
                            <span className="mr-1">{getVerdictEmoji(agentVerdict)}</span>
                            <span>{agentVerdict.toUpperCase()}</span>
                          </div>
                        )}
                      </div>
                      <div className="bg-white p-3 rounded-lg shadow-sm text-gray-800">
                        {agentResponse}
                      </div>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
      
    </div>
  );
};

export default VoiceAssistant;