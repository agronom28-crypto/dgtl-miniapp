const mongoose = require('mongoose');

const starsPaymentSchema = new mongoose.Schema({
  telegramId: { type: Number, required: true, index: true },
  paymentId: { type: String, unique: true, sparse: true },
  amount: { type: Number, required: true },
  itemType: { type: String, enum: ['icon', 'stars_pack'], required: true },
  itemId: { type: mongoose.Schema.Types.ObjectId },
  description: { type: String },
  status: {
    type: String,
    enum: ['pending', 'completed', 'refunded'],
    default: 'pending'
  },
  invoicePayload: { type: String },
  providerPaymentChargeId: { type: String },
  createdAt: { type: Date, default: Date.now },
  completedAt: { type: Date }
});

module.exports = mongoose.model('StarsPayment', starsPaymentSchema);
