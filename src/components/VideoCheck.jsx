import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';

// Define API URL for the deepfake detection
const DEEPFAKE_API_URL = import.meta.env?.VITE_DEEPFAKE_API_URL;

const VideoCheck = () => {
  // State variables
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);
  const [sessionId, setSessionId] = useState(null);
  const [processingComplete, setProcessingComplete] = useState(false);
  const [status, setStatus] = useState({
    status: "processing",
    current_frame: 0,
    total_frames: 0,
    completion: 0,
    has_current_image: false,
    has_summary_image: false,
  });
  const [results, setResults] = useState(null);
  const [resultsLoading, setResultsLoading] = useState(false);
  const [showDetailedResults, setShowDetailedResults] = useState(false);

  // Handler for file input change
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setError(null);
      
      // Generate and display file preview if it's a video
      if (file.type.startsWith('video/')) {
        const videoPreviewUrl = URL.createObjectURL(file);
        console.log("Video preview URL:", videoPreviewUrl);
      }
    }
  };

  // Handler for form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedFile) {
      setError("Please select a video file");
      return;
    }

    setUploading(true);

    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      const response = await axios.post(`${DEEPFAKE_API_URL}/upload`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setSessionId(response.data.session_id);
      setUploading(false);
    } catch (err) {
      setError(err.response?.data?.error || "Error uploading file");
      setUploading(false);
    }
  };

  // Polling effect for processing status
  useEffect(() => {
    let pollInterval;
    
    if (sessionId && !processingComplete) {
      console.log("Polling started for session:", sessionId);
      pollInterval = setInterval(async () => {
        try {
          console.log("Checking status...");
          const response = await axios.get(`${DEEPFAKE_API_URL}/status/${sessionId}`);
          console.log("Status response:", response.data);
          setStatus(response.data);
          
          if (response.data.status === 'completed') {
            console.log("Processing completed!");
            clearInterval(pollInterval);
            setProcessingComplete(true);
            fetchResults();
          }
        } catch (error) {
          console.error("Error checking status:", error);
        }
      }, 1000);
    }
    
    return () => {
      if (pollInterval) {
        console.log("Cleaning up poll interval");
        clearInterval(pollInterval);
      }
    };
  }, [sessionId, processingComplete]);

  // Function to fetch final results
  const fetchResults = async () => {
    setResultsLoading(true);
    try {
      const response = await axios.get(`${DEEPFAKE_API_URL}/results/${sessionId}`);
      setResults(response.data);
      setResultsLoading(false);
    } catch (error) {
      console.error("Error fetching results:", error);
      setResultsLoading(false);
    }
  };

  // Reset function to start over
  const handleReset = () => {
    setSelectedFile(null);
    setSessionId(null);
    setProcessingComplete(false);
    setStatus({
      status: "processing",
      current_frame: 0,
      total_frames: 0,
      completion: 0,
      has_current_image: false,
      has_summary_image: false,
    });
    setResults(null);
    setShowDetailedResults(false);
  };

  // Toggle detailed results display
  const toggleDetailedResults = () => {
    setShowDetailedResults(!showDetailedResults);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white rounded-lg shadow-md overflow-hidden mb-6"
    >
      {/* File Upload Section */}
      {!sessionId && (
        <div className="p-6">
          <AnimatePresence>
            {error && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="mb-4 p-3 bg-red-50 text-red-700 rounded-lg"
              >
                {error}
              </motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={handleSubmit}>
            <div className="border-2 border-dashed border-indigo-200 rounded-lg p-6 text-center mb-5">
              <input
                type="file"
                id="video-upload"
                className="hidden"
                onChange={handleFileChange}
                accept="video/mp4,video/x-m4v,video/*"
              />
              <motion.label 
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                htmlFor="video-upload"
                className="cursor-pointer block"
              >
                {selectedFile ? (
                  <div className="flex flex-col items-center">
                    <motion.div 
                      className="mb-3 text-4xl"
                      initial={{ scale: 0.9 }}
                      animate={{ scale: 1 }}
                      transition={{ duration: 0.3 }}
                    >
                      🎬
                    </motion.div>
                    <div className="text-indigo-600 font-medium mb-2">
                      {selectedFile.name}
                    </div>
                    <span className="text-gray-500 text-sm">
                      ({Math.round(selectedFile.size / 1024 / 1024).toFixed(2)} MB)
                    </span>
                    
                    {/* Video preview if available */}
                    {selectedFile && selectedFile.type.startsWith('video/') && (
                      <div className="mt-4 bg-gray-50 p-2 rounded-lg max-w-xs mx-auto">
                        <video 
                          controls 
                          className="w-full h-auto rounded"
                          preload="metadata"
                        >
                          <source src={URL.createObjectURL(selectedFile)} type={selectedFile.type} />
                          Your browser does not support video preview.
                        </video>
                      </div>
                    )}
                  </div>
                ) : (
                  <div>
                    <motion.div 
                      className="text-5xl mb-4"
                      animate={{ 
                        scale: [1, 1.1, 1],
                        rotate: [0, 5, -5, 0]
                      }}
                      transition={{ 
                        duration: 2,
                        repeat: Infinity,
                        repeatDelay: 1
                      }}
                    >
                      🎥
                    </motion.div>
                    <div className="text-indigo-600 font-medium">Click to upload a video</div>
                    <div className="text-sm text-gray-500 mt-2">MP4, AVI, MOV or MKV (max 100MB)</div>
                    <div className="mt-4 text-xs text-gray-400">Our AI will analyze each frame for deepfake detection</div>
                  </div>
                )}
              </motion.label>
            </div>

            <motion.button
              whileHover={{ backgroundColor: uploading || !selectedFile ? "#9ca3af" : "#4338ca" }}
              whileTap={{ scale: uploading || !selectedFile ? 1 : 0.98 }}
              disabled={uploading || !selectedFile}
              type="submit"
              className={`w-full py-3 rounded-lg ${
                uploading || !selectedFile ? 'bg-gray-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700'
              } text-white shadow-md transition-colors flex items-center justify-center font-medium`}
            >
              {uploading ? (
                <>
                  <motion.div 
                    className="w-5 h-5 border-2 border-white border-t-transparent rounded-full mr-2"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  ></motion.div>
                  Uploading Video...
                </>
              ) : (
                <>Analyze for Deepfakes</>
              )}
            </motion.button>
          </form>
        </div>
      )}

      {/* Processing Status Section */}
      {sessionId && !processingComplete && (
        <div className="p-6">
          <motion.h2 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-xl font-semibold text-indigo-800 mb-4"
          >
            Deepfake Detection in Progress
          </motion.h2>

          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-6"
          >
            <div className="flex justify-between items-center mb-2">
              <p className="font-medium text-gray-700">
                Processing video...
              </p>
              <span className="text-indigo-600 font-semibold">
                {status.completion.toFixed(1)}%
              </span>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-gray-200 rounded-full h-3 mb-2">
              <motion.div
                initial={{ width: "0%" }}
                animate={{ width: `${status.completion}%` }}
                className="bg-indigo-600 h-3 rounded-full"
              ></motion.div>
            </div>

            <p className="text-sm text-gray-600">
              {status.current_frame} / {status.total_frames} frames processed
            </p>
          </motion.div>

          {/* Current Frame and Summary Images */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="text-center rounded-lg overflow-hidden shadow-sm"
            >
              <h3 className="py-2 bg-indigo-50 text-indigo-800 font-medium">
                Current Frame
              </h3>
              <div className="bg-gray-100 p-3 h-64 flex items-center justify-center">
                {status.has_current_image ? (
                  <div className="relative">
                    <img
                      src={`${DEEPFAKE_API_URL}/image/${sessionId}/current?t=${Date.now()}`}
                      alt="Current frame"
                      className="max-h-60 max-w-full rounded shadow"
                      onError={(e) => {
                        e.target.src = "/placeholder-image.png";
                      }}
                    />
                  </div>
                ) : (
                  <p className="text-gray-400 flex items-center">
                    <motion.span
                      animate={{ rotate: 360 }}
                      transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                      className="inline-block mr-2"
                    >⏳</motion.span> 
                    Loading frame...
                  </p>
                )}
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="text-center rounded-lg overflow-hidden shadow-sm"
            >
              <h3 className="py-2 bg-indigo-50 text-indigo-800 font-medium">
                Real-time Analysis
              </h3>
              <div className="bg-gray-100 p-3 h-64 flex items-center justify-center">
                {status.has_summary_image ? (
                  <img
                    src={`${DEEPFAKE_API_URL}/image/${sessionId}/summary?t=${Date.now()}`}
                    alt="Analysis chart"
                    className="max-h-60 max-w-full rounded shadow"
                  />
                ) : (
                  <p className="text-gray-400 flex items-center">
                    <motion.span
                      animate={{ rotate: 360 }}
                      transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                      className="inline-block mr-2"
                    >📊</motion.span>
                    Generating analysis...
                  </p>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      )}

      {/* Results Section - Quick Result Card + Detailed Results */}
      {sessionId && processingComplete && (
        <div className="p-6">
          {resultsLoading ? (
            <div className="text-center py-8">
              <motion.div 
                className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full mx-auto mb-4"
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              ></motion.div>
              <p className="text-gray-500">Loading results...</p>
            </div>
          ) : results ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ type: "spring", stiffness: 100 }}
            >
              {/* Quick Result Card - Always visible */}
              <motion.div 
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="bg-white border border-gray-200 rounded-lg shadow-md overflow-hidden mb-6"
              >
                <div className="flex flex-col md:flex-row">
                  {/* Left side - Video thumbnail and basic info */}
                  <div className="md:w-1/3 p-4 bg-indigo-50 flex flex-col items-center justify-center">
                    <div className="w-full aspect-video bg-gray-800 rounded-lg overflow-hidden mb-3 shadow-sm">
                      {selectedFile && (
                        <video 
                          className="w-full h-full object-cover"
                          poster={status.has_current_image ? `${DEEPFAKE_API_URL}/image/${sessionId}/current` : null}
                          controls
                        >
                          <source src={URL.createObjectURL(selectedFile)} type={selectedFile.type} />
                        </video>
                      )}
                    </div>
                    <div className="text-sm text-gray-600 truncate max-w-full">
                      {selectedFile?.name}
                    </div>
                  </div>
                  
                  {/* Right side - Quick verdict and key metrics */}
                  <div className="md:w-2/3 p-5">
                    <div className="flex justify-between items-start mb-4">
                      <h2 className="text-xl font-bold text-gray-900">Video Analysis Result</h2>
                      <div className="text-xs text-gray-500">
                        {results.processed_frames} frames analyzed
                      </div>
                    </div>
                    
                    {/* Main verdict banner */}
                    <div className={`p-4 mb-4 rounded-lg flex items-center ${
                      results.stats.fake_percentage > 30 
                        ? 'bg-red-100 text-red-700 border border-red-200' 
                        : 'bg-green-100 text-green-700 border border-green-200'
                    }`}>
                      <div className="text-3xl mr-3">
                        {results.stats.fake_percentage > 30 ? '⚠️' : '✅'}
                      </div>
                      <div>
                        <div className="font-bold text-lg">
                          {results.stats.fake_percentage > 30 ? 'Deepfake Detected' : 'Likely Authentic'}
                        </div>
                        <div className="text-sm">
                          {results.stats.fake_percentage > 30 
                            ? `${results.stats.fake_percentage.toFixed(1)}% of frames appear manipulated` 
                            : 'No significant manipulation detected'
                          }
                        </div>
                      </div>
                    </div>
                    
                    {/* Key metrics summary */}
                    <div className="grid grid-cols-3 gap-2 mb-4">
                      <div className="bg-gray-50 p-2 rounded text-center">
                        <div className="text-sm text-gray-600">Fake Frames</div>
                        <div className="font-bold text-red-600">{results.stats.fake_count}</div>
                      </div>
                      <div className="bg-gray-50 p-2 rounded text-center">
                        <div className="text-sm text-gray-600">Real Frames</div>
                        <div className="font-bold text-green-600">{results.stats.real_count}</div>
                      </div>
                      <div className="bg-gray-50 p-2 rounded text-center">
                        <div className="text-sm text-gray-600">Confidence</div>
                        <div className="font-bold text-indigo-600">{results.stats.avg_confidence.toFixed(1)}%</div>
                      </div>
                    </div>
                    
                    {/* Buttons for actions */}
                    <div className="flex flex-wrap gap-2">
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={toggleDetailedResults}
                        className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-3 rounded-lg shadow-sm text-sm font-medium"
                      >
                        {showDetailedResults ? 'Hide Details' : 'Show Detailed Analysis'}
                      </motion.button>
                      
                      <motion.a
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        href={`${DEEPFAKE_API_URL}/download/${sessionId}`}
                        download
                        className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-800 py-2 px-3 rounded-lg shadow-sm text-sm font-medium text-center"
                      >
                        Download Report
                      </motion.a>
                    </div>
                  </div>
                </div>
              </motion.div>
              
              {/* Detailed Results Section - Toggleable */}
              <AnimatePresence>
                {showDetailedResults && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <motion.h2 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-xl font-semibold text-indigo-800 mb-4"
                    >
                      Detailed Analysis
                    </motion.h2>
                    
                    {/* Summary Statistics */}
                    <div className="bg-indigo-50/60 p-5 rounded-lg mb-6">
                      <h3 className="text-lg font-medium text-indigo-800 mb-4">
                        Frame Analysis Statistics
                      </h3>

                      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                        <motion.div 
                          whileHover={{ y: -5 }}
                          className="bg-indigo-600 rounded-lg p-4 text-white shadow-md"
                        >
                          <p className="text-sm font-medium mb-1 opacity-90">Total Frames</p>
                          <p className="text-2xl font-bold">
                            {results.processed_frames}
                          </p>
                        </motion.div>

                        <motion.div 
                          whileHover={{ y: -5 }}
                          className="bg-red-600 rounded-lg p-4 text-white shadow-md"
                        >
                          <p className="text-sm font-medium mb-1 opacity-90">Fake Frames</p>
                          <p className="text-2xl font-bold">
                            {results.stats.fake_count}
                            <span className="text-sm font-normal ml-1 opacity-90">
                              ({results.stats.fake_percentage.toFixed(1)}%)
                            </span>
                          </p>
                        </motion.div>

                        <motion.div 
                          whileHover={{ y: -5 }}
                          className="bg-green-600 rounded-lg p-4 text-white shadow-md"
                        >
                          <p className="text-sm font-medium mb-1 opacity-90">Real Frames</p>
                          <p className="text-2xl font-bold">
                            {results.stats.real_count}
                            <span className="text-sm font-normal ml-1 opacity-90">
                              ({(100 - results.stats.fake_percentage).toFixed(1)}%)
                            </span>
                          </p>
                        </motion.div>

                        <motion.div 
                          whileHover={{ y: -5 }}
                          className="bg-cyan-600 rounded-lg p-4 text-white shadow-md"
                        >
                          <p className="text-sm font-medium mb-1 opacity-90">Confidence</p>
                          <p className="text-2xl font-bold">
                            {results.stats.avg_confidence.toFixed(2)}%
                          </p>
                        </motion.div>
                      </div>
                    </div>

                    {/* Final Analysis Summary Image */}
                    <div className="mb-6">
                      <h3 className="text-md font-medium text-indigo-800 mb-3">
                        Frame-by-Frame Analysis
                      </h3>
                      <div className="bg-white border border-gray-200 p-3 rounded-lg shadow-sm">
                        {results.has_final_summary ? (
                          <img
                            src={`${DEEPFAKE_API_URL}/image/${sessionId}/final?t=${Date.now()}`}
                            alt="Final analysis"
                            className="max-w-full mx-auto rounded"
                          />
                        ) : (
                          <p className="text-gray-400 py-8 text-center">
                            Summary visualization not available
                          </p>
                        )}
                      </div>
                    </div>
                    
                    {/* Technical details and explanation */}
                    <div className="bg-gray-50 p-4 rounded-lg mb-6">
                      <h3 className="text-md font-medium text-indigo-800 mb-2">About Deepfake Detection</h3>
                      <p className="text-sm text-gray-700 mb-3">
                        Our AI model analyzes subtle inconsistencies across video frames that are typically imperceptible to the human eye. These can include:
                      </p>
                      <ul className="text-sm text-gray-700 list-disc pl-5 space-y-1">
                        <li>Unnatural facial movements and expressions</li>
                        <li>Inconsistent lighting and shadows across frames</li>
                        <li>Blending artifacts around modified areas</li>
                        <li>Temporal inconsistencies between consecutive frames</li>
                        <li>Unusual texture patterns that differ from natural video</li>
                      </ul>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
              
              <div className="flex justify-center mt-6">
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={handleReset}
                  className="px-5 py-3 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  <span className="mr-2">🔄</span>
                  Analyze Another Video
                </motion.button>
              </div>
            </motion.div>
          ) : (
            <p className="text-red-500 text-center py-8">Error loading results</p>
          )}
        </div>
      )}
    </motion.div>
  );
};

export default VideoCheck;