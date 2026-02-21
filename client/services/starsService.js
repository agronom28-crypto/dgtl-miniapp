import axios from 'axios';

export const starsService = {
  /**
   * Create Telegram Stars invoice link via backend
   * @param {Object} params
   * @param {number} params.telegramId
   * @param {string} params.itemType - 'icon'
   * @param {string} params.itemId - MongoDB _id of the icon
   * @param {string} params.title
   * @param {string} params.description
   * @param {number} params.starsPrice
   * @param {string} [params.imageUrl]
   * @returns {Promise<{invoiceLink: string, paymentId: string}>}
   */
  createInvoice: async ({ telegramId, itemType, itemId, title, description, starsPrice, imageUrl }) => {
    const res = await axios.post('/api/stars/create-invoice', {
      telegramId,
      itemType,
      itemId,
      title,
      description,
      starsPrice,
      imageUrl,
    });
    return res.data;
  },

  /**
   * Open Telegram Stars invoice in Mini App
   * Calls Telegram.WebApp.openInvoice
   * @param {string} invoiceLink
   * @returns {Promise<string>} - 'paid' | 'cancelled' | 'failed' | 'pending'
   */
  openInvoice: (invoiceLink) => {
    return new Promise((resolve) => {
      const tg = typeof window !== 'undefined' && window.Telegram?.WebApp;
      if (!tg || !tg.openInvoice) {
        console.error('Telegram WebApp not available');
        resolve('failed');
        return;
      }
      tg.openInvoice(invoiceLink, (status) => {
        resolve(status);
      });
    });
  },

  /**
   * Get payment history for a user
   */
  getHistory: async (telegramId) => {
    const res = await axios.get(`/api/stars/history/${telegramId}`);
    return res.data;
  },
};
