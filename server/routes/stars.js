const express = require('express');
const router = express.Router();
const StarsPayment = require('../models/StarsPayment');
const Icon = require('../models/Icon');
const UserIcon = require('../models/UserIcon');
const User = require('../models/User');

// Создать инвойс Telegram Stars (вызывается из Mini App)
router.post('/create-invoice', async (req, res) => {
    try {
        const { telegramId, itemType, itemId, title, description, starsPrice, imageUrl } = req.body;

        if (!telegramId || !itemId || !starsPrice) {
            return res.status(400).json({ success: false, error: 'Missing required fields' });
        }

        const BOT_TOKEN = process.env.BOT_TOKEN;
        if (!BOT_TOKEN) {
            return res.status(500).json({ success: false, error: 'BOT_TOKEN not configured' });
        }

        // Создаём полезную нагрузку (по ней потом идентифицируем платёж)
        const invoicePayload = `${itemType}_${itemId}_${telegramId}_${Date.now()}`;

        // Сохраняем pending платёж
        const payment = new StarsPayment({
            telegramId,
            amount: starsPrice,
            itemType: itemType || 'icon',
            itemId,
            description: description || title,
            invoicePayload,
            status: 'pending'
        });
        await payment.save();

        // Создаём ссылку на invoice через Telegram Bot API
        const tgRes = await fetch(
            `https://api.telegram.org/bot${BOT_TOKEN}/createInvoiceLink`,
            {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    title: title || 'Покупка доли',
                    description: description || title || 'Покупка доли месторождения',
                    payload: invoicePayload,
                    currency: 'XTR',
                    prices: [{ label: title || 'Доля', amount: starsPrice }],
                    photo_url: imageUrl || undefined,
                })
            }
        );
        const tgData = await tgRes.json();

        if (!tgData.ok) {
            console.error('Telegram API error:', tgData);
            return res.status(500).json({ success: false, error: tgData.description || 'Telegram API error' });
        }

        res.json({ success: true, invoiceLink: tgData.result, paymentId: payment._id });
    } catch (error) {
        console.error('Error creating invoice:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

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
        const payment = await StarsPayment.findOne({
            invoicePayload,
            telegramId,
            status: 'pending'
        });
        if (!payment) {
            return res.status(404).json({ success: false, error: 'Pending payment not found' });
        }
        payment.status = 'completed';
        payment.paymentId = paymentId;
        payment.providerPaymentChargeId = providerPaymentChargeId;
        payment.completedAt = new Date();
        await payment.save();

        // Если покупка доли — выдаём пользователю
        if (payment.itemType === 'icon' && payment.itemId) {
            // Ищем userId по telegramId
            const user = await User.findOne({ telegramId: payment.telegramId });
            if (user) {
                const existingUserIcon = await UserIcon.findOne({
                    userId: user._id,
                    iconId: payment.itemId
                });
                if (!existingUserIcon) {
                    const userIcon = new UserIcon({
                        userId: user._id,
                        iconId: payment.itemId,
                        shareLabel: '1/10 доли',
                        purchasedAt: new Date()
                    });
                    await userIcon.save();
                }
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
        const payments = await StarsPayment.find({ telegramId: Number(req.params.telegramId) })
            .sort({ createdAt: -1 })
            .limit(50);
        res.json({ success: true, payments });
    } catch (error) {
        console.error('Error fetching payment history:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

module.exports = router;
