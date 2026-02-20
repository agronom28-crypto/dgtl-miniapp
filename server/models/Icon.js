const mongoose = require('mongoose');

const iconSchema = new mongoose.Schema({
    name: { type: String, required: true },
    imageUrl: { type: String, default: '' },
    price: { type: Number, required: true },
    continent: {
        type: String,
        enum: ['africa', 'asia', 'europe', 'north_america', 'south_america', 'australia', 'cis'],
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
    shareLabel: { type: String, default: '1/10 доли' }
}, {
    timestamps: true
});

module.exports = mongoose.model('Icon', iconSchema);
