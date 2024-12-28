import axios from 'axios';



export const fetchFactChecks = async (query) => {
  try {
    const response = await axios.get(
      `${import.meta.env.VITE_BASE_URL}/claims:search?query=${encodeURIComponent(query)}&key=${import.meta.env.VITE_API_KEY}`
    );
    return response.data.claims || [];
  } catch (error) {
    console.error('Error fetching fact checks:', error);
    return [];
  }
};