const mongoose = require('mongoose');

const userIconSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    iconId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Icon',
        required: true
    },
    shareLabel: { type: String, default: '1/10 доли' },
    purchasedAt: {
        type: Date,
        default: Date.now
    }
});

// Убран unique — игрок может купить несколько долей одного месторождения
userIconSchema.index({ userId: 1, iconId: 1 });

module.exports = mongoose.model('UserIcon', userIconSchema);
