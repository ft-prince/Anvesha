import axios from 'axios';

const API_KEY = 'AIzaSyCOs8C_FXySEt2MUDGhB4KM1_EsQCbDmqE';
const BASE_URL = 'https://factchecktools.googleapis.com/v1alpha1';

export const fetchFactChecks = async (query) => {
  try {
    const response = await axios.get(
      `${BASE_URL}/claims:search?query=${encodeURIComponent(query)}&key=${API_KEY}`
    );
    return response.data.claims || [];
  } catch (error) {
    console.error('Error fetching fact checks:', error);
    return [];
  }
};