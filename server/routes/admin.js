const express = require('express');
const router = express.Router();
const Icon = require('../models/Icon');

// Получить все иконки (включая неактивные)
router.get('/icons', async (req, res) => {
    try {
        const icons = await Icon.find().sort({ createdAt: -1 });
        res.json({ success: true, icons });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Добавить иконку
router.post('/icons', async (req, res) => {
    try {
        const { name, imageUrl, price, category, rarity, stakingRate, description } = req.body;
        const icon = new Icon({ name, imageUrl, price, category, rarity, stakingRate, description });
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

module.exports = router;
