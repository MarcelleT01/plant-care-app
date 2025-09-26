const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    await mongoose.connect('mongodb://127.0.0.1:27017/plantcare', {
      // ces options sont maintenant par défaut dans mongoose >= 6
      // useNewUrlParser: true,
      // useUnifiedTopology: true,
    });
    console.log(' MongoDB connecté à la base plantcare');
  } catch (error) {
    console.error(' Erreur de connexion à MongoDB :', error.message);
    process.exit(1); // stoppe le serveur si pas de connexion
  }
};

module.exports = connectDB;
