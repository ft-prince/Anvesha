// components/verification/InputVerification.jsx
import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const InputVerification = ({ onSubmit }) => {
  const [activeTab, setActiveTab] = useState('text');
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [audioBlob, setAudioBlob] = useState(null);
  const [audioUrl, setAudioUrl] = useState(null);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [filePreview, setFilePreview] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const timerRef = useRef(null);
  const fileInputRef = useRef(null);

  // Handle document upload
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploadedFile(file);
    
    // Create file preview for image or PDF
    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setFilePreview(e.target.result);
      };
      reader.readAsDataURL(file);
    } else {
      setFilePreview(null);
    }
    
    // Simulate upload progress
    let progress = 0;
    const interval = setInterval(() => {
      progress += 10;
      setUploadProgress(progress);
      if (progress >= 100) {
        clearInterval(interval);
        setTimeout(() => {
          setUploadProgress(0);
        }, 500);
      }
    }, 200);
  };
  
  // Handle document submit
  const handleDocumentSubmit = () => {
    if (!uploadedFile) return;
    
    onSubmit({
      type: 'document',
      file: uploadedFile,
      filename: uploadedFile.name
    });
    
    // Reset the file input
    setUploadedFile(null);
    setFilePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Start voice recording
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      audioChunksRef.current = [];
      
      mediaRecorderRef.current.ondataavailable = (e) => {
        audioChunksRef.current.push(e.data);
      };
      
      mediaRecorderRef.current.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        const audioUrl = URL.createObjectURL(audioBlob);
        setAudioBlob(audioBlob);
        setAudioUrl(audioUrl);
        setIsRecording(false);
        
        // Stop all tracks
        stream.getTracks().forEach(track => track.stop());
      };
      
      mediaRecorderRef.current.start();
      setIsRecording(true);
      setRecordingTime(0);
      
      // Start timer
      timerRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
      
    } catch (err) {
      console.error("Error accessing microphone:", err);
      alert("Could not access your microphone. Please check your browser permissions.");
    }
  };
  
  // Stop voice recording
  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      clearInterval(timerRef.current);
    }
  };
  
  // Handle voice submit
  const handleVoiceSubmit = () => {
    if (!audioBlob) return;
    
    onSubmit({
      type: 'voice',
      audio: audioBlob,
      duration: recordingTime
    });
    
    // Reset audio state
    setAudioBlob(null);
    setAudioUrl(null);
    setRecordingTime(0);
  };
  
  // Format recording time
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };
  
  return (
    <div className="bg-white/80 backdrop-blur-sm p-6 rounded-lg shadow-lg mb-8">
      <h2 className="text-2xl font-bold mb-6 text-indigo-900">Verify with Additional Input</h2>
      
      {/* Tab Navigation */}
      <div className="flex mb-6 border-b border-gray-200">
        <button 
          className={`px-4 py-2 font-medium ${activeTab === 'text' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-500 hover:text-gray-700'}`}
          onClick={() => setActiveTab('text')}
        >
          Text Search
        </button>
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
          Voice Query
        </button>
      </div>
      
      {/* Tab Content */}
      <AnimatePresence mode="wait">
        {activeTab === 'text' && (
          <motion.div
            key="text-tab"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
          >
            <p className="text-gray-600 mb-4">
              Enter a topic or claim in the search box above to fact-check it.
            </p>
          </motion.div>
        )}
        
        {activeTab === 'document' && (
          <motion.div
            key="document-tab"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
          >
            <p className="text-gray-600 mb-4">
              Upload a document, article, or image to verify its claims and authenticity.
            </p>
            
            <div className="mb-4">
              <label 
                htmlFor="document-upload" 
                className="block w-full p-4 border-2 border-dashed border-indigo-300 rounded-lg text-center cursor-pointer hover:bg-indigo-50 transition-colors"
              >
                {uploadedFile ? (
                  <span className="text-indigo-700">
                    {uploadedFile.name} ({(uploadedFile.size / 1024).toFixed(1)} KB)
                  </span>
                ) : (
                  <>
                    <span className="text-indigo-500 block mb-2 text-lg">📄 Click to upload a document</span>
                    <span className="text-gray-500 text-sm">PDF, DOCX, JPG, PNG (max 10MB)</span>
                  </>
                )}
              </label>
              <input 
                id="document-upload" 
                type="file" 
                className="hidden" 
                accept=".pdf,.docx,.doc,.jpg,.jpeg,.png"
                onChange={handleFileChange}
                ref={fileInputRef}
              />
            </div>
            
            {uploadProgress > 0 && (
              <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
                <div 
                  className="bg-indigo-600 h-2 rounded-full" 
                  style={{ width: `${uploadProgress}%` }}
                ></div>
              </div>
            )}
            
            {filePreview && (
              <div className="mb-4 p-2 border border-gray-200 rounded-lg">
                <img 
                  src={filePreview} 
                  alt="Preview" 
                  className="max-h-48 mx-auto"
                />
              </div>
            )}
            
            <button
              onClick={handleDocumentSubmit}
              disabled={!uploadedFile}
              className={`w-full py-3 rounded-lg ${uploadedFile ? 'bg-indigo-600 hover:bg-indigo-700 text-white' : 'bg-gray-200 text-gray-500 cursor-not-allowed'} transition-colors`}
            >
              Verify Document
            </button>
          </motion.div>
        )}
        
        {activeTab === 'voice' && (
          <motion.div
            key="voice-tab"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
          >
            <p className="text-gray-600 mb-4">
              Record a voice message with your question or claim to fact-check.
            </p>
            
            <div className="bg-gray-100 p-6 rounded-lg mb-4 flex flex-col items-center">
              {isRecording ? (
                <>
                  <div className="text-xl font-bold text-red-600 mb-2 flex items-center">
                    <span className="inline-block w-3 h-3 bg-red-600 rounded-full mr-2 animate-pulse"></span>
                    Recording... {formatTime(recordingTime)}
                  </div>
                  <motion.div
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ repeat: Infinity, duration: 1.5 }}
                    className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4"
                  >
                    <div className="w-12 h-12 bg-red-500 rounded-full"></div>
                  </motion.div>
                  <button
                    onClick={stopRecording}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                  >
                    Stop Recording
                  </button>
                </>
              ) : audioUrl ? (
                <>
                  <div className="text-lg font-medium text-indigo-600 mb-4">
                    Recording Complete: {formatTime(recordingTime)}
                  </div>
                  <audio 
                    src={audioUrl} 
                    controls 
                    className="mb-4 w-full max-w-md"
                  ></audio>
                  <div className="flex space-x-4">
                    <button
                      onClick={() => {
                        setAudioBlob(null);
                        setAudioUrl(null);
                      }}
                      className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                    >
                      Discard
                    </button>
                    <button
                      onClick={handleVoiceSubmit}
                      className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                    >
                      Submit Voice Query
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <div className="text-lg text-gray-600 mb-4">
                    Tap the microphone to start recording
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={startRecording}
                    className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mb-4"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-indigo-600">
                      <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"></path>
                      <path d="M19 10v2a7 7 0 0 1-14 0v-2"></path>
                      <line x1="12" y1="19" x2="12" y2="23"></line>
                      <line x1="8" y1="23" x2="16" y2="23"></line>
                    </svg>
                  </motion.button>
                  <p className="text-sm text-gray-500">
                    Your browser will request microphone permission
                  </p>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      <div className="mt-6 p-3 bg-indigo-50 rounded-lg">
        <p className="text-sm text-indigo-800">
          <span className="font-semibold">Note:</span> For more accurate results, include specific dates, names, and direct quotes in your queries.
        </p>
      </div>
    </div>
  );
};

export default InputVerification;