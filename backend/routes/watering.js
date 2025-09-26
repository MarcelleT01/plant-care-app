const express = require('express');
const router = express.Router();
const Plant = require('../models/Plant');
const WateringHistory = require('../models/WateringHistory');

// POST - Marquer l'arrosage d'une plante
router.post('/:plantId', async (req, res) => {
  try {
    const { plantId } = req.params;
    const { quantityGiven, notes } = req.body;

    // Créer l'entrée dans l'historique
    const wateringEntry = new WateringHistory({
      plantId,
      quantityGiven: parseFloat(quantityGiven),
      notes: notes || ''
    });

    await wateringEntry.save();

    // Mettre à jour la plante
    const plant = await Plant.findById(plantId);
    if (!plant) {
      return res.status(404).json({ message: 'Plante non trouvée' });
    }

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
router.get('/:plantId/history', async (req, res) => {
  try {
    const { plantId } = req.params;
    const history = await WateringHistory
      .find({ plantId })
      .sort({ wateringDate: -1 })
      .populate('plantId', 'name species');

    res.json(history);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET - Récupérer tout l'historique d'arrosage
router.get('/history/all', async (req, res) => {
  try {
    const history = await WateringHistory
      .find()
      .sort({ wateringDate: -1 })
      .populate('plantId', 'name species image');

    res.json(history);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;