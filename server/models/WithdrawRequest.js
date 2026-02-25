const mongoose = require('mongoose');

const withdrawRequestSchema = new mongoose.Schema({
  telegramId: { type: Number, required: true, index: true },
  walletAddress: { type: String, required: true },
  amountGTL: { type: Number, required: true },
  amountDGTL: { type: Number, required: true },
  commission: { type: Number, default: 0 },
  status: {
    type: String,
    enum: ['pending', 'processing', 'completed', 'failed', 'cancelled'],
    default: 'pending',
    index: true
  },
  txHash: { type: String, default: null },
  errorMessage: { type: String, default: null },
  processedAt: { type: Date, default: null },
}, {
  timestamps: true
});

// Index for efficient queries
withdrawRequestSchema.index({ telegramId: 1, createdAt: -1 });
withdrawRequestSchema.index({ status: 1, createdAt: 1 });

module.exports = mongoose.model('WithdrawRequest', withdrawRequestSchema);
