const mongoose = require('mongoose');

const wateringHistorySchema = new mongoose.Schema({
  plantId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Plant',
    required: true
  },
  wateringDate: {
    type: Date,
    required: true,
    default: Date.now
  },
  quantityGiven: {
    type: Number,
    required: true
  },
  notes: {
    type: String,
    trim: true
  }
});

module.exports = mongoose.model('WateringHistory', wateringHistorySchema);