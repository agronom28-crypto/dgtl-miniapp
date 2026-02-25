const express = require('express');
const router = express.Router();
const withdrawService = require('../services/withdrawService');
const User = require('../models/User');

// POST /api/withdraw/request - Create a new withdrawal request
router.post('/request', async (req, res) => {
  try {
    const { telegramId, amountGTL } = req.body;

    if (!telegramId || !amountGTL) {
      return res.status(400).json({
        success: false,
        error: 'telegramId and amountGTL are required',
      });
    }

    const amount = parseInt(amountGTL);
    if (isNaN(amount) || amount <= 0) {
      return res.status(400).json({
        success: false,
        error: 'amountGTL must be a positive number',
      });
    }

    const result = await withdrawService.createWithdrawRequest(telegramId, amount);

    // Auto-process the withdrawal (can be changed to manual approval later)
    try {
      const processResult = await withdrawService.processWithdrawRequest(result.requestId);
      result.txHash = processResult.txHash;
      result.status = processResult.success ? 'completed' : 'processing';
    } catch (processError) {
      console.error('[Withdraw Route] Auto-process failed:', processError.message);
      result.status = 'failed';
      result.error = processError.message;
    }

    res.json({ success: true, data: result });
  } catch (error) {
    console.error('[Withdraw Route] /request error:', error.message);
    res.status(400).json({ success: false, error: error.message });
  }
});

// POST /api/withdraw/cancel - Cancel a pending withdrawal
router.post('/cancel', async (req, res) => {
  try {
    const { telegramId, requestId } = req.body;

    if (!telegramId || !requestId) {
      return res.status(400).json({
        success: false,
        error: 'telegramId and requestId are required',
      });
    }

    const result = await withdrawService.cancelWithdrawRequest(requestId, telegramId);
    res.json({ success: true, data: result });
  } catch (error) {
    console.error('[Withdraw Route] /cancel error:', error.message);
    res.status(400).json({ success: false, error: error.message });
  }
});

// GET /api/withdraw/history - Get withdrawal history
router.get('/history', async (req, res) => {
  try {
    const { telegramId, page, limit } = req.query;

    if (!telegramId) {
      return res.status(400).json({
        success: false,
        error: 'telegramId is required',
      });
    }

    const result = await withdrawService.getWithdrawHistory(
      parseInt(telegramId),
      parseInt(page) || 1,
      parseInt(limit) || 20
    );

    res.json({ success: true, data: result });
  } catch (error) {
    console.error('[Withdraw Route] /history error:', error.message);
    res.status(500).json({ success: false, error: error.message });
  }
});

// GET /api/withdraw/config - Get withdrawal configuration
router.get('/config', async (req, res) => {
  try {
    const config = withdrawService.getWithdrawConfig();
    res.json({ success: true, data: config });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// GET /api/withdraw/estimate - Estimate withdrawal output
router.get('/estimate', async (req, res) => {
  try {
    const { amountGTL } = req.query;

    if (!amountGTL) {
      return res.status(400).json({
        success: false,
        error: 'amountGTL is required',
      });
    }

    const amount = parseInt(amountGTL);
    const config = withdrawService.getWithdrawConfig();
    const commission = Math.floor(amount * config.commissionRate);
    const amountAfterCommission = amount - commission;
    const amountDGTL = Math.floor(
      amountAfterCommission * config.gtlToDgtlRate * Math.pow(10, config.dgtlDecimals)
    );

    res.json({
      success: true,
      data: {
        inputGTL: amount,
        commission,
        commissionRate: config.commissionRate,
        outputGTL: amountAfterCommission,
        outputDGTL: amountDGTL,
        outputDGTLFormatted: (amountDGTL / Math.pow(10, config.dgtlDecimals)).toFixed(config.dgtlDecimals),
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
