import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

export const login = async (email, password) => {
  try {
    const response = await axios.post(`${API_URL}/auth/login`, {
      email,
      password
    });
    if (response.data.token) {
      localStorage.setItem('user', JSON.stringify(response.data));
    }
    return response.data;
  } catch (error) {
    console.error('Error during login:', error);
    throw error;
  }
};

export const register = async (userData) => {
  try {
    const response = await axios.post(`${API_URL}/auth/register`, userData);
    return response.data;
  } catch (error) {
    console.error('Error during registration:', error);
    throw error;
  }
};

export const logout = () => {
  localStorage.removeItem('user');
};

export const getCurrentUser = () => {
  const userStr = localStorage.getItem('user');
  if (userStr) {
    return JSON.parse(userStr);
  }
  return null;
};

export const updateProfile = async (userData) => {
  try {
    const user = getCurrentUser();
    const response = await axios.put(
      `${API_URL}/users/profile`,
      userData,
      {
        headers: {
          Authorization: `Bearer ${user.token}`
        }
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error updating profile:', error);
    throw error;
  }
};

export const changePassword = async (currentPassword, newPassword) => {
  try {
    const user = getCurrentUser();
    const response = await axios.put(
      `${API_URL}/users/change-password`,
      {
        currentPassword,
        newPassword
      },
      {
        headers: {
          Authorization: `Bearer ${user.token}`
        }
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error changing password:', error);
    throw error;
  }
}; 