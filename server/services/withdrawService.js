const WithdrawRequest = require('../models/WithdrawRequest');
const User = require('../models/User');
const tonClient = require('./tonClient');
const { mnemonicToPrivateKey } = require('@ton/crypto');
require('dotenv').config();

// Configuration
const COMMISSION_RATE = parseFloat(process.env.WITHDRAW_COMMISSION_RATE || '0.05'); // 5%
const MIN_WITHDRAW_GTL = parseInt(process.env.MIN_WITHDRAW_GTL || '100');
const MAX_WITHDRAW_GTL = parseInt(process.env.MAX_WITHDRAW_GTL || '1000000');
const GTL_TO_DGTL_RATE = parseFloat(process.env.GTL_TO_DGTL_RATE || '1'); // 1 GTL = 1 DGTL
const DGTL_DECIMALS = parseInt(process.env.DGTL_DECIMALS || '9');

/**
 * Create a new withdrawal request
 */
async function createWithdrawRequest(telegramId, amountGTL) {
  try {
    // Validate minimum amount
    if (amountGTL < MIN_WITHDRAW_GTL) {
      throw new Error(`Minimum withdrawal amount is ${MIN_WITHDRAW_GTL} GTL`);
    }

    // Validate maximum amount
    if (amountGTL > MAX_WITHDRAW_GTL) {
      throw new Error(`Maximum withdrawal amount is ${MAX_WITHDRAW_GTL} GTL`);
    }

    // Find user
    const user = await User.findOne({ telegramId });
    if (!user) {
      throw new Error('User not found');
    }

    // Check wallet is connected
    if (!user.walletAddress) {
      throw new Error('Wallet not connected. Please connect your TON wallet first.');
    }

    // Check sufficient balance
    if (user.coins < amountGTL) {
      throw new Error(`Insufficient balance. You have ${user.coins} GTL, tried to withdraw ${amountGTL} GTL`);
    }

    // Calculate commission and DGTL amount
    const commission = Math.floor(amountGTL * COMMISSION_RATE);
    const amountAfterCommission = amountGTL - commission;
    const amountDGTL = Math.floor(amountAfterCommission * GTL_TO_DGTL_RATE * Math.pow(10, DGTL_DECIMALS));

    // Deduct coins from user
    user.coins -= amountGTL;
    await user.save();

    // Create withdraw request
    const withdrawRequest = new WithdrawRequest({
      telegramId,
      walletAddress: user.walletAddress,
      amountGTL,
      amountDGTL,
      commission,
      status: 'pending',
    });

    await withdrawRequest.save();

    console.log(`[Withdraw] Request created: ${withdrawRequest._id} for user ${telegramId}, amount: ${amountGTL} GTL`);

    return {
      requestId: withdrawRequest._id,
      amountGTL,
      commission,
      amountDGTL,
      status: 'pending',
    };
  } catch (error) {
    console.error('[Withdraw] createWithdrawRequest error:', error.message);
    throw error;
  }
}

/**
 * Process a pending withdrawal request (send tokens on-chain)
 */
async function processWithdrawRequest(requestId) {
  try {
    const request = await WithdrawRequest.findById(requestId);
    if (!request) {
      throw new Error('Withdraw request not found');
    }

    if (request.status !== 'pending') {
      throw new Error(`Request is already ${request.status}`);
    }

    // Update status to processing
    request.status = 'processing';
    await request.save();

    try {
      // Get wallet key pair
      const mnemonic = process.env.TON_WALLET_MNEMONIC;
      if (!mnemonic) {
        throw new Error('TON_WALLET_MNEMONIC not configured');
      }

      const mnemonicArray = mnemonic.split(' ');
      const keyPair = await mnemonicToPrivateKey(mnemonicArray);

      // Send Jetton tokens
      const result = await tonClient.sendJettons(
        request.walletAddress,
        request.amountDGTL.toString(),
        keyPair
      );

      if (result.success) {
        request.status = 'completed';
        request.txHash = `seqno:${result.seqno}`;
        request.processedAt = new Date();
        await request.save();

        console.log(`[Withdraw] Request ${requestId} completed successfully`);
        return { success: true, txHash: request.txHash };
      } else {
        // Transaction may still go through, mark as processing
        request.errorMessage = result.message || 'Transaction timeout';
        await request.save();

        console.warn(`[Withdraw] Request ${requestId} - transaction timeout`);
        return { success: false, message: result.message };
      }
    } catch (sendError) {
      // On-chain error - mark as failed and refund
      request.status = 'failed';
      request.errorMessage = sendError.message;
      await request.save();

      // Refund the user
      const user = await User.findOne({ telegramId: request.telegramId });
      if (user) {
        user.coins += request.amountGTL;
        await user.save();
        console.log(`[Withdraw] Refunded ${request.amountGTL} GTL to user ${request.telegramId}`);
      }

      console.error(`[Withdraw] Request ${requestId} failed:`, sendError.message);
      throw sendError;
    }
  } catch (error) {
    console.error('[Withdraw] processWithdrawRequest error:', error.message);
    throw error;
  }
}

/**
 * Cancel a pending withdrawal request
 */
async function cancelWithdrawRequest(requestId, telegramId) {
  try {
    const request = await WithdrawRequest.findOne({ _id: requestId, telegramId });
    if (!request) {
      throw new Error('Withdraw request not found');
    }

    if (request.status !== 'pending') {
      throw new Error(`Cannot cancel request with status: ${request.status}`);
    }

    // Refund user
    const user = await User.findOne({ telegramId });
    if (user) {
      user.coins += request.amountGTL;
      await user.save();
    }

    // Update request status
    request.status = 'cancelled';
    request.processedAt = new Date();
    await request.save();

    console.log(`[Withdraw] Request ${requestId} cancelled, ${request.amountGTL} GTL refunded`);

    return { success: true, refundedAmount: request.amountGTL };
  } catch (error) {
    console.error('[Withdraw] cancelWithdrawRequest error:', error.message);
    throw error;
  }
}

/**
 * Get withdrawal history for a user
 */
async function getWithdrawHistory(telegramId, page = 1, limit = 20) {
  try {
    const skip = (page - 1) * limit;
    const requests = await WithdrawRequest.find({ telegramId })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await WithdrawRequest.countDocuments({ telegramId });

    return {
      requests,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    };
  } catch (error) {
    console.error('[Withdraw] getWithdrawHistory error:', error.message);
    throw error;
  }
}

/**
 * Get withdrawal configuration
 */
function getWithdrawConfig() {
  return {
    commissionRate: COMMISSION_RATE,
    minWithdrawGTL: MIN_WITHDRAW_GTL,
    maxWithdrawGTL: MAX_WITHDRAW_GTL,
    gtlToDgtlRate: GTL_TO_DGTL_RATE,
    dgtlDecimals: DGTL_DECIMALS,
  };
}

module.exports = {
  createWithdrawRequest,
  processWithdrawRequest,
  cancelWithdrawRequest,
  getWithdrawHistory,
  getWithdrawConfig,
};
