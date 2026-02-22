const express = require('express');
const router = express.Router();
const Icon = require('../models/Icon');
const UserIcon = require('../models/UserIcon');
const User = require('../models/User');
const mongoose = require('mongoose');

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

// Seed boost cards в коллекцию boosts-cards
router.get('/seed-boosts', async (req, res) => {
    try {
        const db = mongoose.connection.db;
        const collection = db.collection('boosts-cards');
        const boostCards = [
            {
                id: 'hashrate-boost-s',
                title: 'Hashrate Boost S',
                description: 'Increases your hashrate by 10% for 24 hours',
                price: 500,
                starsPrice: 25,
                imageUrl: '/icons/resources/rare_metals.svg',
                effect: 'hashrate',
                multiplier: 1.1,
                durationHours: 24,
                availability: true
            },
            {
                id: 'hashrate-boost-m',
                title: 'Hashrate Boost M',
                description: 'Increases your hashrate by 25% for 48 hours',
                price: 1200,
                starsPrice: 60,
                imageUrl: '/icons/resources/gold.svg',
                effect: 'hashrate',
                multiplier: 1.25,
                durationHours: 48,
                availability: true
            },
            {
                id: 'hashrate-boost-l',
                title: 'Hashrate Boost L',
                description: 'Doubles your hashrate for 72 hours',
                price: 3000,
                starsPrice: 150,
                imageUrl: '/icons/resources/diamonds.svg',
                effect: 'hashrate',
                multiplier: 2.0,
                durationHours: 72,
                availability: true
            },
            {
                id: 'income-boost',
                title: 'Income Boost',
                description: 'Increases all passive income by 50% for 12 hours',
                price: 800,
                starsPrice: 40,
                imageUrl: '/icons/resources/oil_gas.svg',
                effect: 'income',
                multiplier: 1.5,
                durationHours: 12,
                availability: true
            },
            {
                id: 'mining-boost',
                title: 'Mining Speed Boost',
                description: 'Accelerates mining rewards collection by 2x',
                price: 2000,
                starsPrice: 100,
                imageUrl: '/icons/resources/coal.svg',
                effect: 'mining',
                multiplier: 2.0,
                durationHours: 48,
                availability: true
            },
            {
                id: 'lucky-boost',
                title: 'Lucky Boost',
                description: 'Chance to get double rewards on every collection',
                price: 1500,
                starsPrice: 75,
                imageUrl: '/icons/resources/copper.svg',
                effect: 'luck',
                multiplier: 2.0,
                durationHours: 24,
                availability: true
            }
        ];
        // Upsert: вставить если нет, обновить если есть
        let inserted = 0;
        let updated = 0;
        for (const boost of boostCards) {
            const result = await collection.updateOne(
                { id: boost.id },
                { $set: boost },
                { upsert: true }
            );
            if (result.upsertedCount > 0) inserted++;
            else updated++;
        }
        res.json({
            success: true,
            message: `Boost cards seeded: ${inserted} inserted, ${updated} updated`,
            total: boostCards.length
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Git pull - обновить код с GitHub
router.get('/git-pull', (req, res) => {
    const { exec } = require('child_process');
    const path = require('path');
    const projectRoot = path.join(__dirname, '../../');
    exec('cd ' + projectRoot + ' && git checkout -- . && git pull origin master', (error, stdout, stderr) => {
        if (error) {
            return res.json({ success: false, error: error.message, stderr });
        }
        res.json({ success: true, stdout, message: 'Git pull completed. Restart servers to apply.' });
    });
});

// Reseed mining sites
router.get('/reseed-mining-sites', (req, res) => {
    const { exec } = require('child_process');
    const path = require('path');
    const seedScript = path.join(__dirname, '../seedMiningSites.js');
    exec('node ' + seedScript, (error, stdout, stderr) => {
        if (error) {
            return res.json({ success: false, error: error.message, stderr });
        }
        res.json({ success: true, stdout, message: 'Mining sites re-seeded successfully.' });
    });
});

// Fix boost card imageUrls to use correct paths
router.get('/fix-boost-images', async (req, res) => {
    try {
        const db = mongoose.connection.db;
        const collection = db.collection('boosts-cards');
        const imageMap = {
            'hashrate-boost-s': '/icons/resources/rare_metals.svg',
            'hashrate-boost-m': '/icons/resources/gold.svg',
            'hashrate-boost-l': '/icons/resources/diamonds.svg',
            'income-boost': '/icons/resources/oil_gas.svg',
            'mining-boost': '/icons/resources/coal.svg',
            'lucky-boost': '/icons/resources/copper.svg'
        };
        let updated = 0;
        for (const [id, imageUrl] of Object.entries(imageMap)) {
            await collection.updateOne({ id }, { $set: { imageUrl } });
            updated++;
        }
        res.json({ success: true, message: `Updated imageUrl for ${updated} boost cards` });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Clear Next.js cache and touch staking file to trigger recompile
router.get('/clear-cache', (req, res) => {
    const { exec } = require('child_process');
    const path = require('path');
    const clientDir = path.join(__dirname, '../../client');
    exec('rm -rf ' + clientDir + '/.next && touch ' + clientDir + '/pages/staking.tsx', (error, stdout, stderr) => {
        if (error) {
            return res.json({ success: false, error: error.message, stderr });
        }
        res.json({ success: true, message: 'Cache cleared and staking.tsx touched. Next.js should recompile.' });
    });
});

module.exports = router;
