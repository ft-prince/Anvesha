import axios from 'axios';

// Create an axios instance with default config
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000, // 30 seconds timeout (fact checking might take time)
});

// Fact-checking API endpoint
export const factCheckApi = {
  // Check a claim or topic
  checkFact: (query) => {
    return api.post('/api/fact-check', { query });
  },
  
  // Health check endpoint
  checkHealth: () => {
    return api.get('/health');
  }
};

export default api;