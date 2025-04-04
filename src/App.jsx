import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useFactCheck } from './hooks/useFactCheck';
import { filterClaims } from './utils/ratingUtils';
import FilterBar from './components/FilterBar';
import StatsSection from './components/stats/StatsSection';
import FactGraph from './components/FactGraph';
import FactCheckMeter from './components/stats/FactCheckMeter';
import ClaimsList from './components/claims/ClaimsList';
import axios from 'axios';

function App() {
  const [query, setQuery] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [filters, setFilters] = useState({
    searchTerm: '',
    rating: 'all'
  });
  const [showTips, setShowTips] = useState(false);
  const [activeTab, setActiveTab] = useState('text'); // 'text' or 'imageCheck'
  const [inputMode, setInputMode] = useState('text'); // 'text' or 'imageCheck'
  
  // Image moderation states
  const [selectedFile, setSelectedFile] = useState(null);
  const [moderationResult, setModerationResult] = useState(null);
  const [isProcessingImage, setIsProcessingImage] = useState(false);
  const [error, setError] = useState(null);
  
  // API credentials for image moderation
  const API_USER = '1526171324';
  const API_SECRET = '5ycGES28LGNoMm38QipskYCQ5dzLnhPP';

  const { factChecks, newsArticles, isLoading } = useFactCheck(query);
  const filteredClaims = filterClaims(factChecks, filters);

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setInputMode('text');
    setQuery(searchInput);
  };

  // Handle image file selection
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
      setModerationResult(null);
      setError(null);
    }
  };
  
  // Handle image moderation submission
  const handleImageModeration = async (event) => {
    event.preventDefault();
    
    if (!selectedFile) {
      setError('Please select an image to upload');
      return;
    }
    
    setIsProcessingImage(true);
    
    const formData = new FormData();
    formData.append('media', selectedFile);
    formData.append('models', 'genai');
    formData.append('api_user', import.meta.env.VITE_API_USER);
    formData.append('api_secret', import.meta.env.VITE_API_SECRET);
    
    try {
      const response = await axios.post(import.meta.env.VITE_API_IMAGE, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      setModerationResult(response.data);
      setError(null);
      setInputMode('imageCheck');
      setIsProcessingImage(false);
    } catch (err) {
      setError(err.response ? err.response.data : err.message);
      setIsProcessingImage(false);
    }
  };

  // Reset results when query is cleared
  useEffect(() => {
    if (searchInput === '') {
      setQuery('');
    }
  }, [searchInput]);

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="min-h-screen bg-gradient-to-br from-yellow-50 to-blue-50 p-4 md:p-8"
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.1 }}
        className="max-w-6xl mx-auto"
      >
    <div className="flex items-center justify-center gap-3 mb-2">
      <motion.img 
        src="/logo.png" 
        alt="Anvesha Logo"
        className="h-12 md:h-16" 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 15 }}
      />
      <motion.h1 
        className="text-4xl md:text-5xl font-bold text-black"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 15 }}
      >
        Anvesha
      </motion.h1>
    </div>

        <motion.p 
          className="text-lg md:text-xl text-center mb-6 md:mb-8 text-indigo-600"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
        >
          Your Intelligent Fact-Checking Assistant
        </motion.p>
        
        <motion.div 
          className="mb-6 md:mb-8 relative"
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <form onSubmit={handleSearch} className="flex">
            <div className="relative flex-grow">
              <motion.input
                whileFocus={{ boxShadow: "0 0 0 3px rgba(99, 102, 241, 0.4)" }}
                type="text"
                placeholder="Enter a topic to fact check..."
                className="w-full p-3 md:p-4 pr-10 rounded-l-lg shadow-lg bg-white/80 backdrop-blur-sm border border-indigo-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
              />
              {searchInput && (
                <motion.button 
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  type="button"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  onClick={() => setSearchInput('')}
                >
                  ×
                </motion.button>
              )}
            </div>
            <motion.button
              whileHover={{ backgroundColor: "#4338ca" }}
              whileTap={{ scale: 0.95 }}
              type="submit"
              className="bg-indigo-600 hover:bg-indigo-700 text-white p-3 md:p-4 rounded-r-lg shadow-lg transition-colors flex items-center justify-center"
            >
              🔍
              <span className="ml-2 hidden md:inline">Search</span>
            </motion.button>
          </form>
          
          <motion.button 
            whileHover={{ color: "#4338ca" }}
            onClick={() => setShowTips(!showTips)}
            className="mt-2 text-indigo-600 hover:text-indigo-800 text-sm flex items-center"
          >
            ℹ️ 
            {showTips ? 'Hide tips' : 'Show search tips'}
          </motion.button>
          
          <AnimatePresence>
            {showTips && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="mt-2 p-3 bg-white/90 rounded-lg shadow-sm text-sm text-gray-700"
              >
                <p className="mb-2 font-medium text-indigo-800">Pro Tips:</p>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Be specific with your search terms</li>
                  <li>Try searching for controversial topics to see varied fact checks</li>
                  <li>Use the filters to narrow down results by rating</li>
                  <li>Quotes around phrases like "climate change" help find exact matches</li>
                </ul>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Input Method Tabs */}
        <motion.div 
          className="mb-6 bg-white rounded-lg shadow-md overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <div className="flex border-b border-gray-200">
            <motion.button
              whileHover={{ backgroundColor: activeTab === 'text' ? "#e0e7ff" : "#f9fafb" }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setActiveTab('text')}
              className={`flex-1 py-3 px-4 text-center font-medium ${activeTab === 'text' ? 'bg-indigo-50 text-indigo-700 border-b-2 border-indigo-500' : 'text-gray-600 hover:bg-gray-50'}`}
            >
              Text Search
            </motion.button>
            <motion.button
              whileHover={{ backgroundColor: activeTab === 'imageCheck' ? "#e0e7ff" : "#f9fafb" }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setActiveTab('imageCheck')}
              className={`flex-1 py-3 px-4 text-center font-medium ${activeTab === 'imageCheck' ? 'bg-indigo-50 text-indigo-700 border-b-2 border-indigo-500' : 'text-gray-600 hover:bg-gray-50'}`}
            >
              Image Check
            </motion.button>
          </div>
          
          <div className="p-4">
            <AnimatePresence mode="wait">
              {activeTab === 'text' && (
                <motion.div
                  key="text-tab"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  transition={{ duration: 0.3 }}
                >
                  <p className="text-gray-600 mb-4">
                    Use the search box above to fact-check a topic or claim.
                  </p>
                </motion.div>
              )}
              
              {activeTab === 'imageCheck' && (
                <motion.div
                  key="image-tab"
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="border-2 border-dashed border-indigo-200 rounded-lg p-4 text-center mb-4">
                    <input
                      type="file"
                      id="image-upload"
                      className="hidden"
                      onChange={handleFileChange}
                      accept="image/*"
                    />
                    <motion.label 
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      htmlFor="image-upload"
                      className="cursor-pointer block"
                    >
                      {selectedFile ? (
                        <div className="text-indigo-600 mb-2">
                          {selectedFile.name}
                          <span className="text-gray-500 text-sm ml-2">
                            ({(selectedFile.size / 1024).toFixed(1)} KB)
                          </span>
                        </div>
                      ) : (
                        <div>
                          <motion.div 
                            className="text-4xl mb-2"
                            animate={{ 
                              rotate: [0, 5, -5, 0],
                              scale: [1, 1.05, 1]
                            }}
                            transition={{ 
                              duration: 2,
                              repeat: Infinity,
                              repeatDelay: 3
                            }}
                          >📷</motion.div>
                          <div className="text-indigo-600 font-medium">Click to upload an image</div>
                          <div className="text-sm text-gray-500 mt-1">Check if an image is AI-generated or real</div>
                        </div>
                      )}
                    </motion.label>
                  </div>
                  
                  {selectedFile && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className="mb-4">
                        <p className="text-gray-600 text-sm mb-2">Image preview:</p>
                        <div className="bg-gray-100 rounded-lg p-2 flex justify-center">
                          <img 
                            src={URL.createObjectURL(selectedFile)} 
                            alt="Preview" 
                            className="max-h-48 rounded"
                          />
                        </div>
                      </div>
                      
                      <motion.button
                        whileHover={{ backgroundColor: isProcessingImage ? "#9ca3af" : "#4338ca" }}
                        whileTap={{ scale: isProcessingImage ? 1 : 0.98 }}
                        onClick={handleImageModeration}
                        disabled={isProcessingImage}
                        className={`w-full py-2 rounded-lg ${isProcessingImage ? 'bg-gray-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700'} text-white transition-colors flex items-center justify-center`}
                      >
                        {isProcessingImage ? (
                          <>
                            <motion.div 
                              className="w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2"
                              animate={{ rotate: 360 }}
                              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                            ></motion.div>
                            Analyzing Image...
                          </>
                        ) : (
                          <>Check if AI-Generated</>
                        )}
                      </motion.button>
                    </motion.div>
                  )}
                  
                  <AnimatePresence>
                    {error && (
                      <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        className="mt-4 p-3 bg-red-50 text-red-700 rounded-lg"
                      >
                        {error}
                      </motion.div>
                    )}
                  </AnimatePresence>
                  
                  <AnimatePresence>
                    {moderationResult && (
                      <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        transition={{ type: "spring", stiffness: 100 }}
                        className="mt-4 p-4 bg-white border border-gray-200 rounded-lg shadow-sm"
                      >
                        <h3 className="text-lg font-semibold text-indigo-900 mb-3">Image Analysis Result</h3>
                        
                        <div className="mb-4">
                          <div className="text-sm text-gray-600 mb-1">AI Generated Score:</div>
                          <div className="w-full h-4 bg-gray-200 rounded-full overflow-hidden">
                            <motion.div
                              initial={{ width: "0%" }}
                              animate={{ width: `${(moderationResult.type.ai_generated * 100).toFixed(0)}%` }}
                              transition={{ duration: 1, type: "spring" }}
                              className={`h-full ${moderationResult.type.ai_generated > 0.5 ? 'bg-red-500' : 'bg-green-500'}`}
                            ></motion.div>
                          </div>
                          <div className="flex justify-between text-xs mt-1">
                            <span>0%</span>
                            <span className="font-medium">{(moderationResult.type.ai_generated * 100).toFixed(2)}%</span>
                            <span>100%</span>
                          </div>
                        </div>
                        
                        <motion.div 
                          initial={{ scale: 0.95, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          transition={{ delay: 0.5 }}
                          className={`p-3 rounded-lg text-center font-bold ${
                            moderationResult.type.ai_generated > 0.5 
                              ? 'bg-red-100 text-red-700' 
                              : 'bg-green-100 text-green-700'
                          }`}
                        >
                          {moderationResult.type.ai_generated > 0.5 
                            ? 'This image is likely AI-generated (Fake)' 
                            : 'This image is likely Real'}
                        </motion.div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>

        {query && (
          <FilterBar filters={filters} onFilterChange={handleFilterChange} />
        )}

        <AnimatePresence>
          {isLoading ? (
            <motion.div 
              className="text-center py-8 text-indigo-600 flex flex-col items-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div 
                className="w-16 h-16 border-4 border-indigo-200 border-t-indigo-600 rounded-full mb-4"
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              ></motion.div>
              Analyzing facts...
            </motion.div>
          ) : query && filteredClaims && filteredClaims.length > 0 ? (
            <>
              <StatsSection claims={filteredClaims} />
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <motion.div 
                  className="bg-white/80 backdrop-blur-sm p-6 rounded-lg shadow-lg"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4, type: "spring" }}
                >
                  <h2 className="text-2xl font-bold mb-4 text-indigo-900">Fact Check Distribution</h2>
                  <FactGraph data={filteredClaims} />
                </motion.div>
                
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5, type: "spring" }}
                >
                  <FactCheckMeter claims={filteredClaims} />
                </motion.div>
              </div>
              
              <ClaimsList claims={filteredClaims} />
            </>
          ) : query ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: "spring", stiffness: 100 }}
              className="text-center py-12 bg-white/80 backdrop-blur-sm rounded-lg shadow-lg"
            >
              <motion.div 
                className="text-6xl mb-4"
                animate={{ 
                  scale: [1, 1.1, 1],
                  rotate: [0, 5, -5, 0]
                }}
                transition={{ 
                  duration: 2,
                  repeat: Infinity,
                  repeatDelay: 1
                }}
              >🔍</motion.div>
              <h3 className="text-xl font-medium text-gray-700 mb-2">
                No fact checks found
              </h3>
              <p className="text-gray-500">
                Try a different search term or topic
              </p>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="text-center py-16 bg-white/80 backdrop-blur-sm rounded-lg shadow-lg"
            >
              <motion.div 
                className="text-6xl mb-4"
                animate={{ 
                  y: [0, -10, 0],
                }}
                transition={{ 
                  duration: 2,
                  repeat: Infinity,
                  repeatDelay: 1
                }}
              >👆</motion.div>
              <h3 className="text-xl font-medium text-gray-700">
                Choose a fact-checking method above to get started
              </h3>
              <p className="text-gray-500 mt-2">
                Search by text or check if an image is AI-generated
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.footer 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="mt-12 text-center text-sm text-gray-500"
        >
          <p>Anvesha Fact-Checking Assistant © {new Date().getFullYear()}</p>
        </motion.footer>
      </motion.div>
    </motion.div>
  );
}

export default App;