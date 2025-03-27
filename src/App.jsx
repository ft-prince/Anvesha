import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useFactCheck } from './hooks/useFactCheck';
import { filterClaims } from './utils/ratingUtils';
import FilterBar from './components/FilterBar';
import StatsSection from './components/stats/StatsSection';
import FactGraph from './components/FactGraph';
import FactCheckMeter from './components/stats/FactCheckMeter';
import ClaimsList from './components/claims/ClaimsList';
import VoiceVerificationComponent from './components/verification/VoiceVerificationComponent';
import { extractTextFromDocument } from './services/documentService';

function App() {
  const [query, setQuery] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [filters, setFilters] = useState({
    searchTerm: '',
    rating: 'all'
  });
  const [showTips, setShowTips] = useState(false);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [isProcessingFile, setIsProcessingFile] = useState(false);
  const [extractedText, setExtractedText] = useState('');
  const [activeTab, setActiveTab] = useState('text'); // 'text', 'document', or 'voice'
  const [inputMode, setInputMode] = useState('text'); // 'text', 'document', or 'voice'

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

  // File upload handler
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setUploadedFile(file);
      setExtractedText('');
    } else {
      setUploadedFile(null);
    }
  };

  // Process uploaded document
  const handleDocumentProcess = async () => {
    if (!uploadedFile) return;
    
    try {
      setIsProcessingFile(true);
      
      // Extract text from the document (simulated in this demo)
      const text = await extractTextFromDocument(uploadedFile);
      setExtractedText(text);
      
      // Set the extracted text as the search query
      setSearchInput(text.split('\n')[0]); // Use first line as search input
      setQuery(text);
      setInputMode('document');
      
      setIsProcessingFile(false);
    } catch (error) {
      console.error("Error processing document:", error);
      setIsProcessingFile(false);
      // Show error to user (in a real app)
      alert(`Error processing document: ${error.message || error}`);
    }
  };

  // Handle voice input
  const handleVoiceInput = (voiceData) => {
    if (voiceData.text) {
      setSearchInput(voiceData.text);
      setQuery(voiceData.text);
      setInputMode('voice');
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
      className="min-h-screen bg-gradient-to-br from-yellow-50 to-blue-50 p-4 md:p-8"
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-6xl mx-auto"
      >
        <motion.h1 
          className="text-4xl md:text-5xl font-bold mb-2 text-indigo-900 text-center"
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 200 }}
        >
          Anvesha
        </motion.h1>
        <motion.p 
          className="text-lg md:text-xl text-center mb-6 md:mb-8 text-indigo-600"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          Your Intelligent Fact-Checking Assistant
        </motion.p>
        
        <motion.div 
          className="mb-6 md:mb-8 relative"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <form onSubmit={handleSearch} className="flex">
            <div className="relative flex-grow">
              <input
                type="text"
                placeholder="Enter a topic to fact check..."
                className="w-full p-3 md:p-4 pr-10 rounded-l-lg shadow-lg bg-white/80 backdrop-blur-sm border border-indigo-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
              />
              {searchInput && (
                <button 
                  type="button"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  onClick={() => setSearchInput('')}
                >
                  ×
                </button>
              )}
            </div>
            <button
              type="submit"
              className="bg-indigo-600 hover:bg-indigo-700 text-white p-3 md:p-4 rounded-r-lg shadow-lg transition-colors flex items-center justify-center"
            >
              🔍
              <span className="ml-2 hidden md:inline">Search</span>
            </button>
          </form>
          
          <button 
            onClick={() => setShowTips(!showTips)}
            className="mt-2 text-indigo-600 hover:text-indigo-800 text-sm flex items-center"
          >
            ℹ️ 
            {showTips ? 'Hide tips' : 'Show search tips'}
          </button>
          
          <AnimatePresence>
            {showTips && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
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
        <div className="mb-6 bg-white rounded-lg shadow-md overflow-hidden">
          <div className="flex border-b border-gray-200">
            <button
              onClick={() => setActiveTab('text')}
              className={`flex-1 py-3 px-4 text-center font-medium ${activeTab === 'text' ? 'bg-indigo-50 text-indigo-700 border-b-2 border-indigo-500' : 'text-gray-600 hover:bg-gray-50'}`}
            >
              Text Search
            </button>
            <button
              onClick={() => setActiveTab('document')}
              className={`flex-1 py-3 px-4 text-center font-medium ${activeTab === 'document' ? 'bg-indigo-50 text-indigo-700 border-b-2 border-indigo-500' : 'text-gray-600 hover:bg-gray-50'}`}
            >
              Document Upload
            </button>
            <button
              onClick={() => setActiveTab('voice')}
              className={`flex-1 py-3 px-4 text-center font-medium ${activeTab === 'voice' ? 'bg-indigo-50 text-indigo-700 border-b-2 border-indigo-500' : 'text-gray-600 hover:bg-gray-50'}`}
            >
              Voice Search
            </button>
          </div>
          
          <div className="p-4">
            <AnimatePresence mode="wait">
              {activeTab === 'text' && (
                <motion.div
                  key="text-tab"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <p className="text-gray-600 mb-4">
                    Use the search box above to fact-check a topic or claim.
                  </p>
                </motion.div>
              )}
              
              {activeTab === 'document' && (
                <motion.div
                  key="document-tab"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <div className="border-2 border-dashed border-indigo-200 rounded-lg p-4 text-center mb-4">
                    <input
                      type="file"
                      id="document-upload"
                      className="hidden"
                      onChange={handleFileChange}
                      accept=".pdf,.docx,.doc,.jpg,.jpeg,.png,.txt"
                    />
                    <label 
                      htmlFor="document-upload"
                      className="cursor-pointer block"
                    >
                      {uploadedFile ? (
                        <div className="text-indigo-600 mb-2">
                          {uploadedFile.name}
                          <span className="text-gray-500 text-sm ml-2">
                            ({(uploadedFile.size / 1024).toFixed(1)} KB)
                          </span>
                        </div>
                      ) : (
                        <div>
                          <div className="text-4xl mb-2">📄</div>
                          <div className="text-indigo-600 font-medium">Click to upload a document</div>
                          <div className="text-sm text-gray-500 mt-1">PDF, Word, Text, or Image files</div>
                        </div>
                      )}
                    </label>
                  </div>
                  
                  {uploadedFile && (
                    <button
                      onClick={handleDocumentProcess}
                      disabled={isProcessingFile}
                      className={`w-full py-2 rounded-lg ${isProcessingFile ? 'bg-gray-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700'} text-white transition-colors flex items-center justify-center`}
                    >
                      {isProcessingFile ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                          Processing Document...
                        </>
                      ) : (
                        <>Extract & Analyze Document</>
                      )}
                    </button>
                  )}
                  
                  {extractedText && (
                    <div className="mt-4">
                      <h4 className="text-md font-medium text-gray-700 mb-2">Extracted Content:</h4>
                      <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg max-h-60 overflow-y-auto">
                        <pre className="text-sm text-gray-800 whitespace-pre-wrap">{extractedText}</pre>
                      </div>
                    </div>
                  )}
                </motion.div>
              )}
              
              {activeTab === 'voice' && (
                <motion.div
                  key="voice-tab"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <VoiceVerificationComponent onSubmit={handleVoiceInput} />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

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
              <div className="w-16 h-16 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mb-4"></div>
              {inputMode === 'document' ? 'Analyzing document content...' : 
               inputMode === 'voice' ? 'Processing voice query...' : 'Analyzing facts...'}
            </motion.div>
          ) : query && filteredClaims && filteredClaims.length > 0 ? (
            <>
              {/* Input mode banner */}
              {inputMode !== 'text' && (
                <div className="mb-6 bg-indigo-100 rounded-lg p-4 text-indigo-800">
                  <p className="font-medium">
                    {inputMode === 'document' ? 'Document Analysis Results' : 'Voice Query Results'}
                  </p>
                  <p className="text-sm">
                    {inputMode === 'document' 
                      ? `Facts checked based on content from: ${uploadedFile?.name}`
                      : `Facts checked based on voice query: "${searchInput}"`}
                  </p>
                </div>
              )}
            
              <StatsSection claims={filteredClaims} />
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <motion.div 
                  className="bg-white/80 backdrop-blur-sm p-6 rounded-lg shadow-lg"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <h2 className="text-2xl font-bold mb-4 text-indigo-900">Fact Check Distribution</h2>
                  <FactGraph data={filteredClaims} />
                </motion.div>
                
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  <FactCheckMeter claims={filteredClaims} />
                </motion.div>
              </div>
              
              <ClaimsList claims={filteredClaims} />
            </>
          ) : query ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12 bg-white/80 backdrop-blur-sm rounded-lg shadow-lg"
            >
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-xl font-medium text-gray-700 mb-2">
                {inputMode === 'document' ? 'No fact checks found for this document' : 
                 inputMode === 'voice' ? 'No fact checks found for this voice query' : 
                 'No fact checks found'}
              </h3>
              <p className="text-gray-500">
                Try a different search term or topic
              </p>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-16 bg-white/80 backdrop-blur-sm rounded-lg shadow-lg"
            >
              <div className="text-6xl mb-4">👆</div>
              <h3 className="text-xl font-medium text-gray-700">
                Choose a fact-checking method above to get started
              </h3>
              <p className="text-gray-500 mt-2">
                Search by text, upload a document, or use your voice
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