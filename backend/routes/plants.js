const express = require('express');
const router = express.Router();
const multer = require('multer');
const Plant = require('../models/Plant');
const auth = require('../middleware/auth');

const upload = multer({ dest: 'uploads/' });

// GET - Récupérer toutes les plantes de l'utilisateur connecté
router.get('/', auth, async (req, res) => {
  try {
    const plants = await Plant.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(plants);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET - Récupérer une plante par ID (vérifier que c'est bien la plante de l'utilisateur)
router.get('/:id', auth, async (req, res) => {
  try {
    const plant = await Plant.findOne({ _id: req.params.id, user: req.user._id });
    if (!plant) {
      return res.status(404).json({ message: 'Plante non trouvée' });
    }
    res.json(plant);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST - Ajouter une nouvelle plante
router.post('/', auth, upload.single('image'), async (req, res) => {
  try {
    const plantData = {
      user: req.user._id,
      name: req.body.name,
      species: req.body.species,
      purchaseDate: new Date(req.body.purchaseDate),
      wateringNeeds: {
        quantity: parseFloat(req.body.waterQuantity),
        frequency: parseInt(req.body.waterFrequency)
      }
    };

    if (req.file) {
      plantData.image = req.file.path;
    }

    const plant = new Plant(plantData);
    const savedPlant = await plant.save();
    res.status(201).json(savedPlant);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// PUT - Modifier une plante
router.put('/:id', auth, upload.single('image'), async (req, res) => {
  try {
    const updateData = {
      name: req.body.name,
      species: req.body.species,
      purchaseDate: new Date(req.body.purchaseDate),
      wateringNeeds: {
        quantity: parseFloat(req.body.waterQuantity),
        frequency: parseInt(req.body.waterFrequency)
      }
    };

    if (req.file) {
      updateData.image = req.file.path;
    }

    const plant = await Plant.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      updateData,
      { new: true }
    );

    if (!plant) {
      return res.status(404).json({ message: 'Plante non trouvée' });
    }

    res.json(plant);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// DELETE - Supprimer une plante
router.delete('/:id', auth, async (req, res) => {
  try {
    const plant = await Plant.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    if (!plant) {
      return res.status(404).json({ message: 'Plante non trouvée' });
    }
    res.json({ message: 'Plante supprimée avec succès' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;