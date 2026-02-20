const express = require('express');
const router = express.Router();
const Icon = require('../models/Icon');
const UserIcon = require('../models/UserIcon');
const User = require('../models/User');

// Получить все активные иконки для магазина (с фильтрацией по континенту и типу ресурса)
router.get('/', async (req, res) => {
    try {
        const filter = { isActive: true };
        if (req.query.continent) filter.continent = req.query.continent;
        if (req.query.resourceType) filter.resourceType = req.query.resourceType;
        const icons = await Icon.find(filter).sort({ price: 1 });
        res.json({ success: true, icons });
    } catch (error) {
        console.error('Error fetching icons:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// Получить список континентов с количеством месторождений
router.get('/continents', async (req, res) => {
    try {
        const continents = await Icon.aggregate([
            { $match: { isActive: true } },
            { $group: { _id: '$continent', count: { $sum: 1 } } },
            { $sort: { _id: 1 } }
        ]);
        res.json({ success: true, continents });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Купить долю месторождения
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

        // Проверяем баланс
        if (user.coins < icon.price) {
            return res.status(400).json({ success: false, error: 'Not enough coins' });
        }

        // Списываем монеты
        user.coins -= icon.price;
        await user.save();

        // Создаём запись о покупке доли
        const userIcon = new UserIcon({
            userId,
            iconId,
            shareLabel: icon.shareLabel || '1/10 доли'
        });
        await userIcon.save();

        res.json({ success: true, userIcon, remainingCoins: user.coins });
    } catch (error) {
        console.error('Error buying icon:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// Получить месторождения пользователя
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
