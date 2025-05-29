import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

export const uploadImage = async (file) => {
  try {
    const formData = new FormData();
    formData.append('image', file);

    const response = await axios.post(`${API_URL}/upload/image`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });

    return response.data;
  } catch (error) {
    console.error('Error uploading image:', error);
    throw error;
  }
};

export const uploadMultipleImages = async (files) => {
  try {
    const formData = new FormData();
    files.forEach((file) => {
      formData.append('images', file);
    });

    const response = await axios.post(`${API_URL}/upload/images`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });

    return response.data;
  } catch (error) {
    console.error('Error uploading multiple images:', error);
    throw error;
  }
};

export const deleteImage = async (imageUrl) => {
  try {
    await axios.delete(`${API_URL}/upload/image`, {
      data: { imageUrl }
    });
  } catch (error) {
    console.error('Error deleting image:', error);
    throw error;
  }
};

export const getImageUrl = (path) => {
  if (!path) return null;
  if (path.startsWith('http')) return path;
  return `${API_URL}/uploads/${path}`;
}; 