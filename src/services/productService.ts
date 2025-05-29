// src/services/productService.ts
import axios from 'axios';

const API_URL = 'https://ecommerce-backend-dcp4.onrender.com/api/products';

// Interface pour le type Produit
export interface Product {
  _id?: string;
  name: string;
  description: string;
  price: number;
  image?: string;
  createdAt?: Date;
}

// Ajouter un nouveau produit
export const addProduct = async (productData: Omit<Product, '_id' | 'createdAt'>) => {
  const response = await axios.post(API_URL, productData, {
    headers: {
      'Authorization': `Bearer ${getAuthToken()}`,
      'Content-Type': 'application/json'
    }
  });
  return response.data;
};

// Récupérer tous les produits
export const getProducts = async (): Promise<Product[]> => {
  const response = await axios.get(API_URL);
  return response.data;
};

// Récupérer un produit par ID
export const getProductById = async (id: string): Promise<Product> => {
  const response = await axios.get(`${API_URL}/${id}`);
  return response.data;
};

// Mettre à jour un produit
export const updateProduct = async (id: string, productData: Partial<Product>) => {
  const response = await axios.put(`${API_URL}/${id}`, productData, {
    headers: {
      'Authorization': `Bearer ${getAuthToken()}`,
      'Content-Type': 'application/json'
    }
  });
  return response.data;
};

// Supprimer un produit
export const deleteProduct = async (id: string) => {
  const response = await axios.delete(`${API_URL}/${id}`, {
    headers: {
      'Authorization': `Bearer ${getAuthToken()}`
    }
  });
  return response.data;
};

// Fonction utilitaire pour récupérer le token d'authentification
const getAuthToken = (): string | null => {
  const user = localStorage.getItem('user');
  if (user) {
    const parsedUser = JSON.parse(user);
    return parsedUser.token || null;
  }
  return null;
};