const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const path = require('path');
const connectDB = require('./src/config/db');

const errorHandler = require('./middlewares/error');

// Charger les variables d'environnement
dotenv.config({ path: './config.env' });

// Connecter à la base de données
connectDB();

// Routes
const authRoutes = require('./src/routes/authRoutes');
const productRoutes = require('./src/routes/productRoutes');

const app = express();

// Middleware pour traiter les données JSON et les fichiers
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Cookie parser
app.use(cookieParser());

// Servir les fichiers statiques
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Logger dev
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Configuration CORS
const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:5173',
  'http://localhost:5174',
  'http://localhost:4200'
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS: ' + origin));
    }
  },
  credentials: true
}));

// Monter les routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);

// Middleware de gestion d'erreurs
app.use(errorHandler);

const PORT = process.env.PORT || 5001;

const server = app.listen(
  PORT,
  () => console.log(`Serveur en marche en mode ${process.env.NODE_ENV} sur le port ${PORT}`)
);

// Gérer les rejets de promesses non gérées
process.on('unhandledRejection', (err, promise) => {
  console.log(`Erreur: ${err.message}`);
  server.close(() => process.exit(1));
});
