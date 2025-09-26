const mongoose = require('mongoose');

const plantSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  species: {
    type: String,
    required: true,
    trim: true
  },
  purchaseDate: {
    type: Date,
    required: true
  },
  image: {
    type: String,
    default: null
  },
  wateringNeeds: {
    quantity: {
      type: Number,
      required: true // en litres
    },
    frequency: {
      type: Number,
      required: true // en jours
    }
  },
  lastWatered: {
    type: Date,
    default: null
  },
  nextWateringDate: {
    type: Date,
    default: null
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Middleware pour calculer la prochaine date d'arrosage
plantSchema.pre('save', function(next) {
  if (this.lastWatered && this.wateringNeeds.frequency) {
    const nextDate = new Date(this.lastWatered);
    nextDate.setDate(nextDate.getDate() + this.wateringNeeds.frequency);
    this.nextWateringDate = nextDate;
  }
  next();
});

module.exports = mongoose.model('Plant', plantSchema);