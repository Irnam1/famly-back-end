const mongoose = require('mongoose');

const outingSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  date: { type: Date, required: true },
  location: { type: String, required: true },
  budget: { type: Number, required: true },
  familyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Family', required: true },
  participants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
});

module.exports = mongoose.model('Outing', outingSchema);