const mongoose = require('mongoose');

const stakedIconSchema = new mongoose.Schema({
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
    stakedAt: {
        type: Date,
        default: Date.now
    },
    lastClaimAt: {
        type: Date,
        default: Date.now
    },
    isActive: { type: Boolean, default: true }
});

stakedIconSchema.index({ userId: 1, iconId: 1 });
stakedIconSchema.index({ userId: 1, isActive: 1 });

module.exports = mongoose.model('StakedIcon', stakedIconSchema);
