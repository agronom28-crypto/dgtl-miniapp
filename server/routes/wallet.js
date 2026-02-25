const express = require('express');
const router = express.Router();
const User = require('../models/User');
const tonClient = require('../services/tonClient');

// POST /api/wallet/connect - Connect TON wallet to user account
router.post('/connect', async (req, res) => {
  try {
    const { telegramId, walletAddress } = req.body;

    if (!telegramId || !walletAddress) {
      return res.status(400).json({
        success: false,
        error: 'telegramId and walletAddress are required',
      });
    }

    // Validate wallet address format (basic validation)
    if (!walletAddress.match(/^(EQ|UQ|0:)[a-zA-Z0-9_-]+$/)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid TON wallet address format',
      });
    }

    // Check if wallet is already connected to another user
    const existingUser = await User.findOne({
      walletAddress,
      telegramId: { $ne: telegramId },
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        error: 'This wallet is already connected to another account',
      });
    }

    // Update user's wallet address
    const user = await User.findOneAndUpdate(
      { telegramId },
      { walletAddress },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found',
      });
    }

    console.log(`[Wallet] Connected wallet ${walletAddress} to user ${telegramId}`);

    res.json({
      success: true,
      data: {
        telegramId: user.telegramId,
        walletAddress: user.walletAddress,
      },
    });
  } catch (error) {
    console.error('[Wallet Route] /connect error:', error.message);
    res.status(500).json({ success: false, error: error.message });
  }
});

// POST /api/wallet/disconnect - Disconnect TON wallet
router.post('/disconnect', async (req, res) => {
  try {
    const { telegramId } = req.body;

    if (!telegramId) {
      return res.status(400).json({
        success: false,
        error: 'telegramId is required',
      });
    }

    const user = await User.findOneAndUpdate(
      { telegramId },
      { $unset: { walletAddress: 1 } },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found',
      });
    }

    console.log(`[Wallet] Disconnected wallet from user ${telegramId}`);

    res.json({ success: true, data: { telegramId: user.telegramId } });
  } catch (error) {
    console.error('[Wallet Route] /disconnect error:', error.message);
    res.status(500).json({ success: false, error: error.message });
  }
});

// GET /api/wallet/status - Get wallet connection status
router.get('/status', async (req, res) => {
  try {
    const { telegramId } = req.query;

    if (!telegramId) {
      return res.status(400).json({
        success: false,
        error: 'telegramId is required',
      });
    }

    const user = await User.findOne({ telegramId: parseInt(telegramId) });

    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found',
      });
    }

    const response = {
      connected: !!user.walletAddress,
      walletAddress: user.walletAddress || null,
      balance: user.coins || 0,
    };

    // If wallet is connected, try to get on-chain balance
    if (user.walletAddress) {
      try {
        const tonBalance = await tonClient.getBalance(user.walletAddress);
        response.tonBalance = tonBalance;
      } catch (balanceError) {
        response.tonBalance = null;
        response.tonBalanceError = 'Could not fetch TON balance';
      }
    }

    res.json({ success: true, data: response });
  } catch (error) {
    console.error('[Wallet Route] /status error:', error.message);
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
