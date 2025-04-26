import axios from 'axios';

export const fetchNewsArticles = async (query) => {
  try {
    const response = await axios.get(`https://newsapi.org/v2/everything?q=${encodeURIComponent(query)}&apiKey=${import.meta.env.VITE_NEWS_API_KEY}`);
    return response.data.articles || [];
  } catch (error) {
    console.error('Error fetching news:', error);
    return [];
  }
};