const express = require('express');
const router = express.Router();
const Icon = require('../models/Icon');
const UserIcon = require('../models/UserIcon');
const User = require('../models/User');

// Получить все иконки (включая неактивные)
router.get('/icons', async (req, res) => {
    try {
        const icons = await Icon.find().sort({ createdAt: -1 });
        res.json({ success: true, icons });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Добавить иконку (месторождение)
router.post('/icons', async (req, res) => {
    try {
        const {
            name, imageUrl, price, continent, country, resourceType,
            rarity, stakingRate, description, shareLabel,
            totalShares, availableShares, valuationUsd, realPhotoUrl,
            isActive, lat, lng, order
        } = req.body;
        const icon = new Icon({
            name, imageUrl, price, continent, country, resourceType,
            rarity: rarity || 'common',
            stakingRate: stakingRate || 10,
            description: description || '',
            shareLabel: shareLabel || '1/10 доли',
            totalShares: totalShares || 10,
            availableShares: availableShares || 10,
            valuationUsd: valuationUsd || '',
            realPhotoUrl: realPhotoUrl || '',
            isActive: isActive !== undefined ? isActive : true,
            lat, lng,
            order: order || 0
        });
        await icon.save();
        res.json({ success: true, icon });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Обновить иконку
router.put('/icons/:id', async (req, res) => {
    try {
        const icon = await Icon.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!icon) {
            return res.status(404).json({ success: false, error: 'Icon not found' });
        }
        res.json({ success: true, icon });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Удалить иконку
router.delete('/icons/:id', async (req, res) => {
    try {
        const icon = await Icon.findByIdAndDelete(req.params.id);
        if (!icon) {
            return res.status(404).json({ success: false, error: 'Icon not found' });
        }
        res.json({ success: true, message: 'Icon deleted' });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Получить статистику
router.get('/stats', async (req, res) => {
    try {
        const totalIcons = await Icon.countDocuments();
        const activeIcons = await Icon.countDocuments({ isActive: true });
        const totalUsers = await User.countDocuments();
        const totalPurchases = await UserIcon.countDocuments();
        res.json({
            success: true,
            stats: { totalIcons, activeIcons, totalUsers, totalPurchases }
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Получить статистику по пользователям
router.get('/users', async (req, res) => {
    try {
        const users = await User.find().sort({ coins: -1 }).limit(100);
        res.json({ success: true, users });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Обновить starsPrice и stakingRate для всех существующих иконок
router.post('/icons/update-prices', async (req, res) => {
    try {
        const icons = await Icon.find({});
        let updated = 0;
        for (const icon of icons) {
            const needsUpdate = (!icon.starsPrice || icon.starsPrice === 0) || (icon.stakingRate === 10 && icon.hashrate > 0);
            if (needsUpdate) {
                const starsPrice = icon.starsPrice && icon.starsPrice > 0 ? icon.starsPrice : Math.max(1, Math.round(icon.price / 2));
                const stakingRate = icon.hashrate > 0 ? icon.hashrate : icon.stakingRate;
                await Icon.findByIdAndUpdate(icon._id, { starsPrice, stakingRate });
                updated++;
            }
        }
        res.json({ success: true, updated, total: icons.length });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// GET версия update-prices (для вызова из браузера)
router.get('/icons/update-prices', async (req, res) => {
    try {
        const icons = await Icon.find({});
        let updated = 0;
        for (const icon of icons) {
            const starsPrice = icon.starsPrice && icon.starsPrice > 0 ? icon.starsPrice : Math.max(1, Math.round(icon.price / 2));
            const stakingRate = icon.hashrate > 0 ? icon.hashrate : icon.stakingRate;
            await Icon.findByIdAndUpdate(icon._id, { starsPrice, stakingRate });
            updated++;
        }
        res.json({ success: true, updated, total: icons.length, message: 'Updated starsPrice and stakingRate for all icons' });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

module.exports = router;
