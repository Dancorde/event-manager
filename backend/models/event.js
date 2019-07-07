const mongoose = require('mongoose');

const eventSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  description: { type: String, required: true },
  startTime: { type: Date, required: true, default: Date.now },
  endTime: { type: Date, required: true }
});

module.exports = mongoose.model('Event', eventSchema);
