import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

export const getUsers = async () => {
  try {
    const response = await axios.get(`${API_URL}/users`);
    return response.data;
  } catch (error) {
    console.error('Error fetching users:', error);
    throw error;
  }
};

export const getUser = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/users/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching user:', error);
    throw error;
  }
};

export const createUser = async (userData) => {
  try {
    const response = await axios.post(`${API_URL}/users`, userData);
    return response.data;
  } catch (error) {
    console.error('Error creating user:', error);
    throw error;
  }
};

export const updateUser = async (id, userData) => {
  try {
    const response = await axios.put(`${API_URL}/users/${id}`, userData);
    return response.data;
  } catch (error) {
    console.error('Error updating user:', error);
    throw error;
  }
};

export const deleteUser = async (id) => {
  try {
    await axios.delete(`${API_URL}/users/${id}`);
  } catch (error) {
    console.error('Error deleting user:', error);
    throw error;
  }
};

export const getUserOrders = async (userId) => {
  try {
    const response = await axios.get(`${API_URL}/users/${userId}/orders`);
    return response.data;
  } catch (error) {
    console.error('Error fetching user orders:', error);
    throw error;
  }
};

export const getUserAddresses = async (userId) => {
  try {
    const response = await axios.get(`${API_URL}/users/${userId}/addresses`);
    return response.data;
  } catch (error) {
    console.error('Error fetching user addresses:', error);
    throw error;
  }
};

export const addUserAddress = async (userId, addressData) => {
  try {
    const response = await axios.post(`${API_URL}/users/${userId}/addresses`, addressData);
    return response.data;
  } catch (error) {
    console.error('Error adding user address:', error);
    throw error;
  }
};

export const updateUserAddress = async (userId, addressId, addressData) => {
  try {
    const response = await axios.put(
      `${API_URL}/users/${userId}/addresses/${addressId}`,
      addressData
    );
    return response.data;
  } catch (error) {
    console.error('Error updating user address:', error);
    throw error;
  }
};

export const deleteUserAddress = async (userId, addressId) => {
  try {
    await axios.delete(`${API_URL}/users/${userId}/addresses/${addressId}`);
  } catch (error) {
    console.error('Error deleting user address:', error);
    throw error;
  }
}; 