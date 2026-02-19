const mongoose = require('mongoose');

const iconSchema = new mongoose.Schema({
    name: { type: String, required: true },
    imageUrl: { type: String, required: true },
    price: { type: Number, required: true },
    category: { 
        type: String, 
        enum: ['oil_rig', 'mine', 'quarry', 'factory', 'other'],
        default: 'other' 
    },
    rarity: { 
        type: String, 
        enum: ['common', 'rare', 'epic', 'legendary'],
        default: 'common' 
    },
    isActive: { type: Boolean, default: true },
    stakingRate: { type: Number, default: 10 },
    description: { type: String, default: '' }
}, {
    timestamps: true
});

module.exports = mongoose.model('Icon', iconSchema);
