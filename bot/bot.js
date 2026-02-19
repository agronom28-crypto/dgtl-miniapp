require('dotenv').config();
const TelegramBot = require('node-telegram-bot-api');
const { handleStartCommand } = require('./handlers/botHandlers');
const { handlePreCheckout, handleSuccessfulPayment, sendStarsInvoice } = require('./handlers/starsHandler');

// Проверяем наличие необходимых переменных окружения
const requiredEnvVars = ['TELEGRAM_BOT_TOKEN', 'WEB_APP_URL', 'SERVER_URL'];
const missingEnvVars = requiredEnvVars.filter(varName => !process.env[varName]);

if (missingEnvVars.length > 0) {
  console.error('Missing required environment variables:', missingEnvVars);
  process.exit(1);
}

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const WEB_APP_URL = process.env.WEB_APP_URL;
const SERVER_URL = process.env.SERVER_URL;

console.log('Initializing bot with configuration:', {
  TELEGRAM_BOT_TOKEN: TELEGRAM_BOT_TOKEN ? '**present**' : '**missing**',
  WEB_APP_URL,
  SERVER_URL
});

const bot = new TelegramBot(TELEGRAM_BOT_TOKEN, { 
  polling: true,
  webHook: false
});

// Обработка ошибок polling
bot.on('polling_error', (error) => {
  console.error('Polling error:', error);
  if (bot.isPolling()) {
    bot.stopPolling();
  }
  setTimeout(() => {
    bot.startPolling();
  }, 5000);
});

// Обработка ошибок webhook
bot.on('webhook_error', (error) => {
  console.error('Webhook error:', error);
});

// === STARS PAYMENT HANDLERS ===

// Pre-checkout query — КРИТИЧНО: ответить за 10 секунд
bot.on('pre_checkout_query', async (query) => {
  console.log('Received pre_checkout_query:', query.id);
  await handlePreCheckout(bot, query);
});

// Successful payment
bot.on('message', async (msg) => {
  if (msg.successful_payment) {
    console.log('Received successful_payment message');
    await handleSuccessfulPayment(bot, msg);
  }
});

// Команда /buy для тестирования (можно убрать в продакшене)
bot.onText(/\/buy/, async (msg) => {
  const chatId = msg.chat.id;
  const telegramId = msg.from.id;
  
  // Пример: отправить тестовый invoice на 1 Star
  await sendStarsInvoice(bot, chatId, telegramId, {
    type: 'stars_pack',
    id: null,
    title: 'Тестовая покупка',
    description: 'Тестовый платёж 1 Star',
    starsPrice: 1,
    imageUrl: null
  });
});

// === END STARS HANDLERS ===

// Обработка команды /start
bot.onText(/\/start/, async (msg) => {
  console.log('Received /start command from user:', {
    userId: msg.from.id,
    username: msg.from.username,
    firstName: msg.from.first_name,
    lastName: msg.from.last_name
  });
  
  try {
    await handleStartCommand(bot, msg);
  } catch (error) {
    console.error('Error handling /start command:', error);
    bot.sendMessage(msg.chat.id, 'Произошла ошибка. Пожалуйста, попробуйте позже.');
  }
});

console.log('Bot is starting...');

// Проверяем, что бот успешно запустился
bot.getMe().then((botInfo) => {
  console.log('Bot successfully started:', botInfo);
}).catch((error) => {
  console.error('Failed to start bot:', error);
  process.exit(1);
});
