const mongoose = require('mongoose');

const iconSchema = new mongoose.Schema({
    name: { type: String, required: true },
    imageUrl: { type: String, default: '' },
    price: { type: Number, required: true },
    valuationUsd: { type: String, default: '' },
    starsPrice: { type: Number, default: 0 },
    continent: {
        type: String,
        enum: ['africa', 'asia', 'europe', 'north_america', 'south_america', 'australia', 'russia'],
        required: true
    },
    country: { type: String, required: true },
    resourceType: {
        type: String,
        enum: ['gold', 'copper', 'iron', 'rare_metals', 'oil_gas', 'diamonds', 'coal'],
        required: true
    },
    resourceEmoji: { type: String, default: '' },
    rarity: {
        type: String,
        enum: ['common', 'rare', 'epic', 'legendary'],
        default: 'common'
    },
    isActive: { type: Boolean, default: true },
    stakingRate: { type: Number, default: 10 },
    description: { type: String, default: '' },
    shareLabel: { type: String, default: '' },
    totalShares: { type: Number, default: 1 },
    availableShares: { type: Number, default: 1 },
    lat: { type: Number },
    lng: { type: Number },
    hashrate: { type: Number, default: 0 },
    realPhotoUrl: { type: String, default: '' },
    order: { type: Number, default: 0 }
}, {
    timestamps: true
});

module.exports = mongoose.model('Icon', iconSchema);
