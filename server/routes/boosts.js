const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const User = require('../models/User');

// GET /api/boosts - получить все boost cards из коллекции boosts-cards
router.get('/', async (req, res) => {
  try {
    const db = mongoose.connection.db;
    const collection = db.collection('boosts-cards');
    const boostCards = await collection.find({ availability: true }).toArray();
    res.json(boostCards);
  } catch (error) {
    console.error('Error fetching boost cards:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// POST /api/boosts/buy - купить буст за монеты
router.post('/buy', async (req, res) => {
  try {
    const { boostId, userId } = req.body;

    if (!boostId || typeof boostId !== 'string') {
      return res.status(400).json({ message: 'Invalid boost ID provided.' });
    }

    const db = mongoose.connection.db;
    const collection = db.collection('boosts-cards');
    const boostCard = await collection.findOne({ id: boostId });

    if (!boostCard) {
      return res.status(404).json({ message: `Boost with ID '${boostId}' not found.` });
    }

    // Найти пользователя
    let user;
    if (userId) {
      user = await User.findById(userId);
    }
    if (!user) {
      return res.status(404).json({ message: 'User not found. Please try again.' });
    }

    const { price } = boostCard;

    if (user.coins < price) {
      return res.status(400).json({ message: 'Insufficient coins to purchase this boost.' });
    }

    // Списываем монеты и добавляем буст
    const boostKey = `boosts.${boostId}`;
    const updatedUser = await User.findByIdAndUpdate(
      user._id,
      {
        $inc: { coins: -price, [boostKey]: 1 }
      },
      { new: true }
    );

    res.json({
      success: true,
      message: 'Boost purchased successfully!',
      remainingCoins: updatedUser.coins,
      boosts: updatedUser.boosts
    });
  } catch (error) {
    console.error('Error buying boost:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// GET /api/boosts/user/:userId - получить бусты пользователя
router.get('/user/:userId', async (req, res) => {
  try {
    const user = await User.findById(req.params.userId).select('boosts coins');
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json({ success: true, boosts: user.boosts || {}, coins: user.coins });
  } catch (error) {
    console.error('Error fetching user boosts:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;
