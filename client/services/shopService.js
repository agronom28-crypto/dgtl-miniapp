import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || '';

export const shopService = {
    // Получить все иконки магазина
    getIcons: async () => {
        try {
            const response = await axios.get('/api/shop');
            return response.data;
        } catch (error) {
            console.error('Error fetching icons:', error);
            throw error;
        }
    },

    // Купить иконку
    buyIcon: async (userId, iconId) => {
        try {
            const response = await axios.post('/api/shop/buy', { userId, iconId });
            return response.data;
        } catch (error) {
            console.error('Error buying icon:', error);
            throw error;
        }
    },

    // Получить купленные иконки пользователя
    getMyIcons: async (userId) => {
        try {
            const response = await axios.get(`/api/shop/my/${userId}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching user icons:', error);
            throw error;
        }
    }
};
