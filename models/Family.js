const mongoose = require('mongoose');

const familySchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String }
});

module.exports = mongoose.model('Family', familySchema);