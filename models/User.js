const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    roles: [{ type: String, enum: ['admin', 'editor', 'user'], default: 'user' }],
    familyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Family', required: false }
})

module.exports = mongoose.model('User', userSchema);