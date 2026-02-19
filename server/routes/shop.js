const express = require('express');
const router = express.Router();
const Icon = require('../models/Icon');
const UserIcon = require('../models/UserIcon');
const User = require('../models/User');

// Получить все активные иконки для магазина
router.get('/', async (req, res) => {
    try {
        const icons = await Icon.find({ isActive: true }).sort({ price: 1 });
        res.json({ success: true, icons });
    } catch (error) {
        console.error('Error fetching icons:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// Купить иконку
router.post('/buy', async (req, res) => {
    try {
        const { userId, iconId } = req.body;

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ success: false, error: 'User not found' });
        }

        const icon = await Icon.findById(iconId);
        if (!icon) {
            return res.status(404).json({ success: false, error: 'Icon not found' });
        }

        if (!icon.isActive) {
            return res.status(400).json({ success: false, error: 'Icon is not available' });
        }

        // Проверяем, не куплена ли уже
        const existing = await UserIcon.findOne({ userId, iconId });
        if (existing) {
            return res.status(400).json({ success: false, error: 'Icon already purchased' });
        }

        // Проверяем баланс
        if (user.coins < icon.price) {
            return res.status(400).json({ success: false, error: 'Not enough coins' });
        }

        // Списываем монеты
        user.coins -= icon.price;
        await user.save();

        // Создаём запись о покупке
        const userIcon = new UserIcon({ userId, iconId });
        await userIcon.save();

        res.json({ success: true, userIcon, remainingCoins: user.coins });
    } catch (error) {
        console.error('Error buying icon:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// Получить иконки пользователя
router.get('/my/:userId', async (req, res) => {
    try {
        const userIcons = await UserIcon.find({ userId: req.params.userId })
            .populate('iconId');
        res.json({ success: true, userIcons });
    } catch (error) {
        console.error('Error fetching user icons:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

module.exports = router;
