const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const cron = require('node-cron');

const connectDB = require('./config/db'); // fichier db.js
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Connexion à MongoDB
connectDB(); // affichera un message si succès ou erreur

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));

// Configuration Multer pour upload d'images
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});
const upload = multer({ storage: storage });

// Routes
const plantRoutes = require('./routes/plants');
const wateringRoutes = require('./routes/watering');
const notificationRoutes = require('./routes/notifications');

app.use('/api/plants', plantRoutes);
app.use('/api/watering', wateringRoutes);
app.use('/api/notifications', notificationRoutes);

// Tâche cron pour les notifications (toutes les heures)
cron.schedule('0 * * * *', () => {
  console.log('Vérification des notifications d\'arrosage...');
  // Logique de notification à implémenter ici
});

// Lancer le serveur
app.listen(PORT, () => {
  console.log(`Serveur démarré sur le port ${PORT}`);
});
