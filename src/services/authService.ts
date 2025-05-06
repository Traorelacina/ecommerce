// src/services/authService.ts
import axios from 'axios';

const API_URL = 'http://localhost:5000/api/auth';

export const register = (username: string, email: string, password: string) => {
  return axios.post(API_URL + '/register', {
    username,
    email,
    password
  });
};

export const login = (email: string, password: string) => {
  return axios.post(API_URL + '/login', {
    email,
    password
  }).then(response => {
    if (response.data.token) {
      localStorage.setItem('user', JSON.stringify(response.data));
    }
    return response.data;
  });
};

export const logout = () => {
  localStorage.removeItem('user');
};