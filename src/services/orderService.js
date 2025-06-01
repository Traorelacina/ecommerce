import client from '../api/client.tsx';

// Interface pour les articles de commande
export const OrderStatus = {
  PENDING: 'pending',
  CONFIRMED: 'confirmed',
  PROCESSING: 'processing',
  SHIPPED: 'shipped',
  DELIVERED: 'delivered',
  CANCELLED: 'cancelled'
};

// Créer une nouvelle commande
export const createOrder = async (orderData) => {
  try {
    console.log('Création de commande avec les données:', orderData);
    const response = await client.post('/orders', orderData);
    console.log('Commande créée avec succès:', response.data);
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la création de la commande:', error);
    throw error;
  }
};

// Récupérer toutes les commandes
export const getOrders = async () => {
  try {
    const response = await client.get('/orders');
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la récupération des commandes:', error);
    throw error;
  }
};

// Récupérer une commande par ID
export const getOrder = async (orderId) => {
  try {
    const response = await client.get(`/orders/${orderId}`);
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la récupération de la commande:', error);
    throw error;
  }
};

// Récupérer les commandes d'un utilisateur
export const getUserOrders = async (userId) => {
  try {
    const response = await client.get(`/orders/user/${userId}`);
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la récupération des commandes utilisateur:', error);
    throw error;
  }
};

// Mettre à jour le statut d'une commande
export const updateOrderStatus = async (orderId, status) => {
  try {
    const response = await client.put(`/orders/${orderId}/status`, { status });
    console.log('Statut de commande mis à jour:', response.data);
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la mise à jour du statut:', error);
    throw error;
  }
};

// Mettre à jour une commande complète
export const updateOrder = async (orderId, orderData) => {
  try {
    const response = await client.put(`/orders/${orderId}`, orderData);
    console.log('Commande mise à jour:', response.data);
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la mise à jour de la commande:', error);
    throw error;
  }
};

// Annuler une commande
export const cancelOrder = async (orderId) => {
  try {
    const response = await client.put(`/orders/${orderId}/cancel`);
    console.log('Commande annulée:', response.data);
    return response.data;
  } catch (error) {
    console.error('Erreur lors de l\'annulation de la commande:', error);
    throw error;
  }
};

// Supprimer une commande
export const deleteOrder = async (orderId) => {
  try {
    await client.delete(`/orders/${orderId}`);
    console.log('Commande supprimée avec succès');
  } catch (error) {
    console.error('Erreur lors de la suppression de la commande:', error);
    throw error;
  }
};

// Confirmer une commande
export const confirmOrder = async (orderId) => {
  try {
    const response = await client.put(`/orders/${orderId}/confirm`);
    console.log('Commande confirmée:', response.data);
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la confirmation de la commande:', error);
    throw error;
  }
};

// Calculer le total d'une commande
export const calculateOrderTotal = (items) => {
  return items.reduce((total, item) => {
    return total + (item.price * item.quantity);
  }, 0);
};

// Validation des données de commande
export const validateOrderData = (orderData) => {
  const errors = [];

  if (!orderData.items || orderData.items.length === 0) {
    errors.push('La commande doit contenir au moins un article');
  }

  if (!orderData.shippingAddress) {
    errors.push('L\'adresse de livraison est requise');
  } else {
    if (!orderData.shippingAddress.street) errors.push('La rue est requise');
    if (!orderData.shippingAddress.city) errors.push('La ville est requise');
    if (!orderData.shippingAddress.postalCode) errors.push('Le code postal est requis');
    if (!orderData.shippingAddress.country) errors.push('Le pays est requis');
  }

  if (!orderData.totalAmount || orderData.totalAmount <= 0) {
    errors.push('Le montant total doit être supérieur à 0');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

// Formater les données de commande pour l'envoi
export const formatOrderData = (cartItems, shippingAddress, userInfo = {}) => {
  const items = cartItems.map(item => ({
    productId: item._id || item.id,
    name: item.name,
    price: item.price,
    quantity: item.quantity,
    image: item.image
  }));

  const totalAmount = calculateOrderTotal(items);

  return {
    items,
    totalAmount,
    shippingAddress: {
      street: shippingAddress.street,
      city: shippingAddress.city,
      postalCode: shippingAddress.postalCode,
      country: shippingAddress.country,
      firstName: shippingAddress.firstName || userInfo.firstName,
      lastName: shippingAddress.lastName || userInfo.lastName,
      phone: shippingAddress.phone || userInfo.phone
    },
    status: OrderStatus.PENDING,
    userId: userInfo.userId || null
  };
};
