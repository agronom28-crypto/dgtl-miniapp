const express = require('express');
const router = express.Router();
const StakedIcon = require('../models/StakedIcon');
const UserIcon = require('../models/UserIcon');
const Icon = require('../models/Icon');
const User = require('../models/User');

// Базовая ставка (баллов в час) — можно вынести в конфиг/БД
let BASE_RATE = 10;

// Поставить иконку в стейкинг
router.post('/stake', async (req, res) => {
    try {
        const { userId, iconId } = req.body;

        // Проверяем, что иконка куплена
        const userIcon = await UserIcon.findOne({ userId, iconId });
        if (!userIcon) {
            return res.status(400).json({ success: false, error: 'Icon not owned' });
        }

        // Проверяем, не застейкана ли уже
        const existing = await StakedIcon.findOne({ userId, iconId, isActive: true });
        if (existing) {
            return res.status(400).json({ success: false, error: 'Icon already staked' });
        }

        const stakedIcon = new StakedIcon({
            userId,
            iconId,
            stakedAt: new Date(),
            lastClaimAt: new Date(),
            isActive: true
        });
        await stakedIcon.save();

        res.json({ success: true, stakedIcon });
    } catch (error) {
        console.error('Error staking icon:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// Снять иконку из стейкинга
router.post('/unstake', async (req, res) => {
    try {
        const { userId, iconId } = req.body;

        const stakedIcon = await StakedIcon.findOne({ userId, iconId, isActive: true });
        if (!stakedIcon) {
            return res.status(404).json({ success: false, error: 'Staked icon not found' });
        }

        stakedIcon.isActive = false;
        await stakedIcon.save();

        res.json({ success: true, message: 'Icon unstaked' });
    } catch (error) {
        console.error('Error unstaking icon:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// Собрать пассивный доход
router.post('/claim', async (req, res) => {
    try {
        const { userId } = req.body;

        const activeStakes = await StakedIcon.find({ userId, isActive: true })
            .populate('iconId');

        if (activeStakes.length === 0) {
            return res.status(400).json({ success: false, error: 'No active stakes' });
        }

        let totalEarnings = 0;
        const now = new Date();

        for (const stake of activeStakes) {
            const hoursStaked = (now - stake.lastClaimAt) / (1000 * 60 * 60);
            const rate = stake.iconId.stakingRate || BASE_RATE;
            const earnings = Math.floor(hoursStaked * rate);
            totalEarnings += earnings;
            stake.lastClaimAt = now;
            await stake.save();
        }

        // Начисляем монеты пользователю
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ success: false, error: 'User not found' });
        }

        user.coins += totalEarnings;
        await user.save();

        res.json({ success: true, earnings: totalEarnings, totalCoins: user.coins });
    } catch (error) {
        console.error('Error claiming earnings:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// Получить активные стейки пользователя
router.get('/active/:userId', async (req, res) => {
    try {
        const stakes = await StakedIcon.find({ 
            userId: req.params.userId, 
            isActive: true 
        }).populate('iconId');
        res.json({ success: true, stakes });
    } catch (error) {
        console.error('Error fetching stakes:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// Рассчитать текущий накопленный доход (без сбора)
router.get('/earnings/:userId', async (req, res) => {
    try {
        const stakes = await StakedIcon.find({ 
            userId: req.params.userId, 
            isActive: true 
        }).populate('iconId');

        const now = new Date();
        let totalEarnings = 0;

        for (const stake of stakes) {
            const hoursStaked = (now - stake.lastClaimAt) / (1000 * 60 * 60);
            const rate = stake.iconId.stakingRate || BASE_RATE;
            totalEarnings += Math.floor(hoursStaked * rate);
        }

        res.json({ success: true, pendingEarnings: totalEarnings, activeStakes: stakes.length });
    } catch (error) {
        console.error('Error calculating earnings:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// Получить/изменить базовую ставку (админ)
router.get('/config', (req, res) => {
    res.json({ success: true, baseRate: BASE_RATE });
});

router.put('/config', (req, res) => {
    const { baseRate } = req.body;
    if (typeof baseRate === 'number' && baseRate > 0) {
        BASE_RATE = baseRate;
        res.json({ success: true, baseRate: BASE_RATE });
    } else {
        res.status(400).json({ success: false, error: 'Invalid base rate' });
    }
});

module.exports = router;
