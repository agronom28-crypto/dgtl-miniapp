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
    purchasedAt: {
        type: Date,
        default: Date.now
    }
});

userIconSchema.index({ userId: 1, iconId: 1 }, { unique: true });

module.exports = mongoose.model('UserIcon', userIconSchema);
