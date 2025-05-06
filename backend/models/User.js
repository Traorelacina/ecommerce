const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, "Le nom d'utilisateur est requis"],
    unique: true,
    trim: true,
    minlength: [3, "Le nom d'utilisateur doit contenir au moins 3 caractères"]
  },
  email: {
    type: String,
    required: [true, "L'email est requis"],
    unique: true,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      'Veuillez fournir un email valide'
    ]
  },
  password: {
    type: String,
    required: [true, 'Le mot de passe est requis'],
    minlength: [8, 'Le mot de passe doit contenir au moins 8 caractères'],
    select: false // Ne retourne pas le mot de passe dans les requêtes
  },
  avatar: {
    type: String,
    default: 'default-avatar.jpg'
  },
  provider: {
    type: String,
    default: 'local'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Chiffrer le mot de passe avant de sauvegarder
UserSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    next();
  }
  
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Méthode pour comparer les mots de passe
UserSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Générer un JWT
UserSchema.methods.getSignedJwtToken = function() {
  return jwt.sign(
    { id: this._id },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRE }
  );
};

module.exports = mongoose.model('User', UserSchema);