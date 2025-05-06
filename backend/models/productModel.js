const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Le nom du produit est requis'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'La description est requise']
  },
  price: {
    type: Number,
    required: [true, 'Le prix est requis'],
    min: [0, 'Le prix ne peut pas être négatif']
  },
  oldPrice: {
    type: Number,
    min: [0, 'L\'ancien prix ne peut pas être négatif']
  },
  category: {
    type: String,
    required: [true, 'La catégorie est requise']
  },
  image: {
    type: String,
    required: [true, 'L\'image est requise']
  },
  rating: {
    type: Number,
    default: 0,
    min: [0, 'La note ne peut pas être inférieure à 0'],
    max: [5, 'La note ne peut pas dépasser 5']
  },
  isNew: {
    type: Boolean,
    default: false
  },
  isPromo: {
    type: Boolean,
    default: false
  },
  stock: {
    type: Number,
    required: true,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Middleware pour supprimer l'image associée lorsqu'un produit est supprimé
productSchema.pre('remove', async function(next) {
  try {
    const fs = require('fs');
    const path = require('path');
    const imagePath = path.join(__dirname, '../../uploads', this.image.split('/uploads/')[1]);
    
    fs.unlink(imagePath, (err) => {
      if (err) console.error('Erreur suppression fichier:', err);
    });
    next();
  } catch (err) {
    next(err);
  }
});

module.exports = mongoose.model('Product', productSchema);