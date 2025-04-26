import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useFactCheck } from './hooks/useFactCheck';
import { filterClaims } from './utils/ratingUtils';
import FilterBar from './components/FilterBar';
import StatsSection from './components/stats/StatsSection';
import FactGraph from './components/FactGraph';
import FactCheckMeter from './components/stats/FactCheckMeter';
import ClaimsList from './components/claims/ClaimsList';
import AgentResponse from './components/AgentResponse';
import VideoCheck from './components/VideoCheck';
import ImageCheck from './components/ImageCheck';
import SpeechButton from './components/SpeechButton';
import VoiceAssistant from './components/VoiceAssistant';
import axios from 'axios';

function App() {
  const [query, setQuery] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [filters, setFilters] = useState({
    searchTerm: '',
    rating: 'all'
  });
  const [showTips, setShowTips] = useState(false);
  const [activeTab, setActiveTab] = useState('text'); // 'text', 'imageCheck', or 'videoCheck'
  const [inputMode, setInputMode] = useState('text'); // 'text', 'imageCheck', or 'videoCheck'
  
  // Error state (shared)
  const [error, setError] = useState(null);
  
  // Agent response states
  const [agentResponse, setAgentResponse] = useState(null);
  const [agentVerdict, setAgentVerdict] = useState(null);
  const [isAgentLoading, setIsAgentLoading] = useState(false);
  const [sources, setSources] = useState([]);
  const [confidence, setConfidence] = useState(null);

  const { factChecks, newsArticles, isLoading } = useFactCheck(query);
  const filteredClaims = factChecks ? filterClaims(factChecks, filters) : [];

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleSearch = (e) => {
    if (e) e.preventDefault();
    setInputMode('text');
    setQuery(searchInput);
    
    // Only call the agent API if there's a valid search input
    if (searchInput.trim()) {
      fetchAgentResponse(searchInput);
    } else {
      // Clear agent response if search is cleared
      setAgentResponse(null);
      setAgentVerdict(null);
      setSources([]);
      setConfidence(null);
    }
  };
  
  // Handle transcript from speech recognition
  const handleTranscriptReceived = (transcript) => {
    if (transcript && transcript.trim()) {
      setSearchInput(transcript);
      // Automatically trigger search after a short delay
      setTimeout(() => {
        handleSearch();
      }, 500);
    }
  };
  
  // Fetch response from fact-checker agent API
  const fetchAgentResponse = async (queryText) => {
    setIsAgentLoading(true);
    setAgentResponse(null);
    setAgentVerdict(null);
    setSources([]);
    setConfidence(null);
    setError(null);
    
    try {
      const response = await axios.post('/api/fact-check', {
        query: queryText
      });
      
      console.log('Agent API Response:', response.data);
      
      setAgentResponse(response.data.result);
      setAgentVerdict(response.data.verdict);
      
      // Handle sources array
      if (response.data.sources && Array.isArray(response.data.sources)) {
        setSources(response.data.sources);
      }
      
      // Handle confidence
      if (response.data.confidence) {
        setConfidence(response.data.confidence);
      }
      
      setIsAgentLoading(false);
    } catch (err) {
      console.error('Error fetching agent response:', err);
      setError(`Failed to get agent response: ${err.message}`);
      setIsAgentLoading(false);
    }
  };

  // Reset results when query is cleared
  useEffect(() => {
    if (searchInput === '') {
      setQuery('');
      setAgentResponse(null);
      setAgentVerdict(null);
      setSources([]);
      setConfidence(null);
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
          <form onSubmit={handleSearch} className="flex items-center">
            <div className="mr-2">
              <SpeechButton 
                onTranscriptReceived={handleTranscriptReceived} 
                disabled={isAgentLoading || isLoading}
              />
            </div>
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
                  <li>Click the microphone icon to search with your voice</li>
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
              whileHover={{ backgroundColor: activeTab === 'voiceAssistant' ? "#e0e7ff" : "#f9fafb" }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setActiveTab('voiceAssistant')}
              className={`flex-1 py-3 px-4 text-center font-medium ${activeTab === 'voiceAssistant' ? 'bg-indigo-50 text-indigo-700 border-b-2 border-indigo-500' : 'text-gray-600 hover:bg-gray-50'}`}
            >
              Voice Assistant
            </motion.button>
            <motion.button
              whileHover={{ backgroundColor: activeTab === 'imageCheck' ? "#e0e7ff" : "#f9fafb" }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setActiveTab('imageCheck')}
              className={`flex-1 py-3 px-4 text-center font-medium ${activeTab === 'imageCheck' ? 'bg-indigo-50 text-indigo-700 border-b-2 border-indigo-500' : 'text-gray-600 hover:bg-gray-50'}`}
            >
              Image Check
            </motion.button>
            <motion.button
              whileHover={{ backgroundColor: activeTab === 'videoCheck' ? "#e0e7ff" : "#f9fafb" }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setActiveTab('videoCheck')}
              className={`flex-1 py-3 px-4 text-center font-medium ${activeTab === 'videoCheck' ? 'bg-indigo-50 text-indigo-700 border-b-2 border-indigo-500' : 'text-gray-600 hover:bg-gray-50'}`}
            >
              Video Check
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
                    Use the search box above to fact-check a topic or claim. You can also use voice search by clicking the microphone icon.
                  </p>
                  
  
                </motion.div>
              )}
              
              {activeTab === 'voiceAssistant' && (
                <motion.div
                  key="voice-assistant-tab"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  transition={{ duration: 0.3 }}
                >
                  <VoiceAssistant />
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
                  <ImageCheck />
                </motion.div>
              )}
              
              {activeTab === 'videoCheck' && (
                <motion.div
                  key="video-tab"
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  transition={{ duration: 0.3 }}
                >
                  <VideoCheck />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>

        {query && filteredClaims && (
          <FilterBar filters={filters} onFilterChange={handleFilterChange} />
        )}

        <AnimatePresence>
          {isLoading || isAgentLoading ? (
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
          ) : query ? (
            <>
              {/* Agent Response Component - Added proper props */}
              <AgentResponse 
                response={agentResponse} 
                verdict={agentVerdict} 
                isLoading={isAgentLoading}
                sources={sources}
                confidence={confidence}
              />
              
              {filteredClaims && filteredClaims.length > 0 ? (
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
              ) : (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ type: "spring", stiffness: 100 }}
                  className="text-center py-12 bg-white/80 backdrop-blur-sm rounded-lg shadow-lg"
                >
                  {!agentResponse ? (
                    <>
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
                    </>
                  ) : null}
                </motion.div>
              )}
            </>
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
                Search by text, use voice search, check if an image is AI-generated, or analyze videos for deepfakes
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
          <div className="mt-2 flex justify-center space-x-4">
            <a 
              href="https://anvesha-fact-checker.azurewebsites.net/docs" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-indigo-500 hover:text-indigo-600 hover:underline"
            >
              Anvesha Agent API Docs
            </a>
            <a 
              href="https://speechapi-app.azurewebsites.net/docs" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-indigo-500 hover:text-indigo-600 hover:underline"
            >
            Anvesha STT API Docs
            </a>
            <a 
              href="http://deepfake-detection.eastus.azurecontainer.io:8000/docs" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-indigo-500 hover:text-indigo-600 hover:underline"
            >
              Anvesha Video Detection Api Docs 
            </a>
          </div>
        </motion.footer>

      </motion.div>
    </motion.div>
  );
}

export default App;