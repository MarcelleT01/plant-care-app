const express = require('express');
const router = express.Router();
const Plant = require('../models/Plant');
const Notification = require('../models/Notification');

// GET - Récupérer toutes les notifications
router.get('/', async (req, res) => {
  try {
    const notifications = await Notification
      .find()
      .sort({ createdAt: -1 })
      .populate('plantId', 'name species image');

    res.json(notifications);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET - Vérifier les plantes qui ont besoin d'arrosage
router.get('/check-watering', async (req, res) => {
  try {
    const today = new Date();
    const plants = await Plant.find();
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
router.put('/:id/read', async (req, res) => {
  try {
    const notification = await Notification.findByIdAndUpdate(
      req.params.id,
      { isRead: true },
      { new: true }
    );

    if (!notification) {
      return res.status(404).json({ message: 'Notification non trouvée' });
    }

    res.json(notification);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// DELETE - Supprimer une notification
router.delete('/:id', async (req, res) => {
  try {
    const notification = await Notification.findByIdAndDelete(req.params.id);
    if (!notification) {
      return res.status(404).json({ message: 'Notification non trouvée' });
    }
    res.json({ message: 'Notification supprimée' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;