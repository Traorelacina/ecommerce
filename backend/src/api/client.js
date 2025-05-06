import axios from 'axios';

const client = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
  withCredentials: true,
  timeout: 10000,
});

// Configuration des headers par défaut
client.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  
  if (config.method === 'delete') {
    config.headers['Content-Type'] = 'application/json';
  }
  
  return config;
}, error => {
  return Promise.reject(error);
});

// Gestion des erreurs
client.interceptors.response.use(
  response => response,
  error => {
    if (error.response) {
      console.error('Erreur API:', {
        status: error.response.status,
        data: error.response.data,
        url: error.config.url
      });
      
      if (error.response.status === 401) {
        // Gérer la déconnexion si token invalide
        localStorage.removeItem('token');
        window.location.href = '/login';
      }
    } else if (error.request) {
      console.error('Pas de réponse du serveur:', error.request);
    } else {
      console.error('Erreur de configuration:', error.message);
    }
    
    return Promise.reject(error);
  }
);

export default client;