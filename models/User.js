const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    telegramId: { type: String, required: true, unique: true },
    balance: { type: Number, default: 0 },
    hasJoinedAirdrop: { type: Boolean, default: false },
    tasksCompleted: { type: Array, default: [] },
    referralCount: { type: Number, default: 0 },
    referrerId: { type: String, default: null },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', UserSchema);
