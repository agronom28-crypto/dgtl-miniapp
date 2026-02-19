const axios = require('axios');
const { SERVER_URL } = require('../config/botConfig');

function generatePayload(telegramId, itemType, itemId) {
  return `stars_${telegramId}_${itemType}_${itemId || 'pack'}_${Date.now()}`;
}

const sendStarsInvoice = async (bot, chatId, telegramId, item) => {
  try {
    const payload = generatePayload(telegramId, item.type, item.id);

    await axios.post(`${SERVER_URL}/api/stars/create-pending`, {
      telegramId,
      amount: item.starsPrice,
      itemType: item.type,
      itemId: item.id,
      description: item.title,
      invoicePayload: payload
    });

    await bot.sendInvoice(
      chatId,
      item.title,
      item.description,
      payload,
      '',
      'XTR',
      [{ label: item.title, amount: item.starsPrice }],
      {
        photo_url: item.imageUrl || undefined,
        photo_width: 256,
        photo_height: 256
      }
    );
  } catch (error) {
    console.error('Error sending Stars invoice:', error);
    await bot.sendMessage(chatId, 'Ошибка при создании платежа.');
  }
};

const handlePreCheckout = async (bot, query) => {
  try {
    await bot.answerPreCheckoutQuery(query.id, true);
  } catch (error) {
    console.error('Error in pre-checkout:', error);
    try {
      await bot.answerPreCheckoutQuery(query.id, false, {
        error_message: 'Ошибка обработки платежа'
      });
    } catch (e) {
      console.error('Failed to reject pre-checkout:', e);
    }
  }
};

const handleSuccessfulPayment = async (bot, msg) => {
  const payment = msg.successful_payment;
  const telegramId = msg.from.id;
  const chatId = msg.chat.id;

  try {
    const response = await axios.post(`${SERVER_URL}/api/stars/confirm`, {
      invoicePayload: payment.invoice_payload,
      paymentId: payment.telegram_payment_charge_id,
      providerPaymentChargeId: payment.provider_payment_charge_id,
      telegramId
    });

    if (response.data.success) {
      await bot.sendMessage(chatId,
        `Оплата прошла успешно! ⭐\nСумма: ${payment.total_amount} Stars\nПредмет уже в инвентаре.`
      );
    } else {
      await bot.sendMessage(chatId, 'Платёж получен, но ошибка обработки.');
    }
  } catch (error) {
    console.error('Error confirming payment:', error);
    await bot.sendMessage(chatId, 'Платёж получен, обработка может занять время.');
  }
};

module.exports = { sendStarsInvoice, handlePreCheckout, handleSuccessfulPayment };
