const express = require('express');
const router = express.Router();
const Plant = require('../models/Plant');
const Notification = require('../models/Notification');
const auth = require('../middleware/auth');

// GET - Récupérer toutes les notifications de l'utilisateur
router.get('/', auth, async (req, res) => {
  try {
    // Récupérer toutes les plantes de l'utilisateur
    const userPlants = await Plant.find({ user: req.user._id }).select('_id');
    const plantIds = userPlants.map(plant => plant._id);
    
    const notifications = await Notification
      .find({ plantId: { $in: plantIds } })
      .sort({ createdAt: -1 })
      .populate('plantId', 'name species image');

    res.json(notifications);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET - Vérifier les plantes qui ont besoin d'arrosage
router.get('/check-watering', auth, async (req, res) => {
  try {
    const today = new Date();
    const plants = await Plant.find({ user: req.user._id });
    const notifications = [];

    for (const plant of plants) {
      if (plant.nextWateringDate && plant.nextWateringDate <= today) {
        // Créer une notification si elle n'existe pas déjà
        const existingNotification = await Notification.findOne({
          plantId: plant._id,
          type: 'watering',
          isRead: false
        });

        if (!existingNotification) {
          const notification = new Notification({
            plantId: plant._id,
            message: `Il est temps d'arroser ${plant.name} (${plant.species})`,
            type: 'watering'
          });

          await notification.save();
          notifications.push(notification);
        }
      }
    }

    res.json({
      message: `${notifications.length} nouvelles notifications créées`,
      notifications
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// PUT - Marquer une notification comme lue
router.put('/:id/read', auth, async (req, res) => {
  try {
    // Vérifier que la notification appartient à une plante de l'utilisateur
    const notification = await Notification.findById(req.params.id).populate('plantId');
    if (!notification) {
      return res.status(404).json({ message: 'Notification non trouvée' });
    }

    // Vérifier que la plante appartient à l'utilisateur
    const plant = await Plant.findOne({ _id: notification.plantId._id, user: req.user._id });
    if (!plant) {
      return res.status(403).json({ message: 'Accès non autorisé' });
    }

    notification.isRead = true;
    await notification.save();

    res.json(notification);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// DELETE - Supprimer une notification
router.delete('/:id', auth, async (req, res) => {
  try {
    // Vérifier que la notification appartient à une plante de l'utilisateur
    const notification = await Notification.findById(req.params.id).populate('plantId');
    if (!notification) {
      return res.status(404).json({ message: 'Notification non trouvée' });
    }

    // Vérifier que la plante appartient à l'utilisateur
    const plant = await Plant.findOne({ _id: notification.plantId._id, user: req.user._id });
    if (!plant) {
      return res.status(403).json({ message: 'Accès non autorisé' });
    }

    await Notification.findByIdAndDelete(req.params.id);
    res.json({ message: 'Notification supprimée' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;