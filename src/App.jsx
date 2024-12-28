import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useFactCheck } from './hooks/useFactCheck';
import { filterClaims } from './utils/ratingUtils';
import FilterBar from './components/FilterBar';
import StatsSection from './components/stats/StatsSection';
import FactGraph from './components/FactGraph';
import ClaimsList from './components/claims/ClaimsList';

function App() {
  const [query, setQuery] = useState('');
  const [filters, setFilters] = useState({
    searchTerm: '',
    rating: 'all'
  });

  const { factChecks, newsArticles, isLoading } = useFactCheck(query);
  const filteredClaims = filterClaims(factChecks, filters);

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 p-8"
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-6xl mx-auto"
      >
        <motion.h1 
          className="text-5xl font-bold mb-2 text-indigo-900 text-center"
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 200 }}
        >
          Anvesha
        </motion.h1>
        <motion.p 
          className="text-xl text-center mb-8 text-indigo-600"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          Your Intelligent Fact-Checking Assistant
        </motion.p>
        
        <motion.div 
          className="mb-8"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <input
            type="text"
            placeholder="Enter a topic to fact check..."
            className="w-full p-4 rounded-lg shadow-lg bg-white/80 backdrop-blur-sm border border-indigo-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </motion.div>

        <FilterBar filters={filters} onFilterChange={handleFilterChange} />

        <AnimatePresence>
          {isLoading ? (
            <motion.div 
              className="text-center py-8 text-indigo-600"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <div className="loader"></div>
              Analyzing facts...
            </motion.div>
          ) : (
            <>
              <StatsSection claims={filteredClaims} />
              <motion.div 
                className="bg-white/80 backdrop-blur-sm p-6 rounded-lg shadow-lg mb-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <h2 className="text-2xl font-bold mb-4 text-indigo-900">Fact Check Distribution</h2>
                <FactGraph data={filteredClaims} />
              </motion.div>
              <ClaimsList claims={filteredClaims} />
            </>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
}

export default App;