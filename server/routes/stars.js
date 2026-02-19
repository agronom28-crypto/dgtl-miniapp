const express = require('express');
const router = express.Router();
const StarsPayment = require('../models/StarsPayment');
const Icon = require('../models/Icon');
const UserIcon = require('../models/UserIcon');

// Создать запись о pending-платеже (вызывается из бота после отправки invoice)
router.post('/create-pending', async (req, res) => {
  try {
    const { telegramId, amount, itemType, itemId, description, invoicePayload } = req.body;
    
    const payment = new StarsPayment({
      telegramId,
      amount,
      itemType,
      itemId,
      description,
      invoicePayload,
      status: 'pending'
    });
    
    await payment.save();
    res.json({ success: true, paymentId: payment._id });
  } catch (error) {
    console.error('Error creating pending payment:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Подтвердить платёж (вызывается из бота после successful_payment)
router.post('/confirm', async (req, res) => {
  try {
    const { invoicePayload, paymentId, providerPaymentChargeId, telegramId } = req.body;
    
    // Находим pending-платёж
    const payment = await StarsPayment.findOne({ 
      invoicePayload, 
      telegramId,
      status: 'pending' 
    });
    
    if (!payment) {
      return res.status(404).json({ success: false, error: 'Pending payment not found' });
    }
    
    // Обновляем статус
    payment.status = 'completed';
    payment.paymentId = paymentId;
    payment.providerPaymentChargeId = providerPaymentChargeId;
    payment.completedAt = new Date();
    await payment.save();
    
    // Если покупка иконки — выдаём пользователю
    if (payment.itemType === 'icon' && payment.itemId) {
      const existingUserIcon = await UserIcon.findOne({
        telegramId: payment.telegramId,
        iconId: payment.itemId
      });
      
      if (!existingUserIcon) {
        const userIcon = new UserIcon({
          telegramId: payment.telegramId,
          iconId: payment.itemId,
          acquiredAt: new Date()
        });
        await userIcon.save();
      }
    }
    
    res.json({ success: true, payment });
  } catch (error) {
    console.error('Error confirming payment:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// История платежей пользователя
router.get('/history/:telegramId', async (req, res) => {
  try {
    const payments = await StarsPayment.find({ 
      telegramId: Number(req.params.telegramId) 
    })
    .sort({ createdAt: -1 })
    .limit(50);
    
    res.json({ success: true, payments });
  } catch (error) {
    console.error('Error fetching payment history:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
