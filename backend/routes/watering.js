const express = require('express');
const router = express.Router();
const Plant = require('../models/Plant');
const WateringHistory = require('../models/WateringHistory');
const auth = require('../middleware/auth');

// POST - Marquer l'arrosage d'une plante
router.post('/:plantId', auth, async (req, res) => {
  try {
    const { plantId } = req.params;
    const { quantityGiven, notes } = req.body;

    // Vérifier que la plante appartient à l'utilisateur
    const plant = await Plant.findOne({ _id: plantId, user: req.user._id });
    if (!plant) {
      return res.status(404).json({ message: 'Plante non trouvée' });
    }

    // Créer l'entrée dans l'historique
    const wateringEntry = new WateringHistory({
      plantId,
      quantityGiven: parseFloat(quantityGiven),
      notes: notes || ''
    });

    await wateringEntry.save();

    // Mettre à jour la plante
    plant.lastWatered = new Date();
    await plant.save();

    res.status(201).json({
      message: 'Arrosage enregistré avec succès',
      watering: wateringEntry,
      plant: plant
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// GET - Récupérer l'historique d'arrosage d'une plante
router.get('/:plantId/history', auth, async (req, res) => {
  try {
    const { plantId } = req.params;
    
    // Vérifier que la plante appartient à l'utilisateur
    const plant = await Plant.findOne({ _id: plantId, user: req.user._id });
    if (!plant) {
      return res.status(404).json({ message: 'Plante non trouvée' });
    }
    
    const history = await WateringHistory
      .find({ plantId })
      .sort({ wateringDate: -1 })
      .populate('plantId', 'name species');

    res.json(history);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET - Récupérer tout l'historique d'arrosage de l'utilisateur
router.get('/history/all', auth, async (req, res) => {
  try {
    // Récupérer toutes les plantes de l'utilisateur
    const userPlants = await Plant.find({ user: req.user._id }).select('_id');
    const plantIds = userPlants.map(plant => plant._id);
    
    const history = await WateringHistory
      .find({ plantId: { $in: plantIds } })
      .sort({ wateringDate: -1 })
      .populate('plantId', 'name species image');

    res.json(history);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;