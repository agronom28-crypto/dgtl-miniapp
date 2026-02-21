import axios from 'axios';

export const shopService = {
    // Получить все месторождения магазина
    getIcons: async (continent, resourceType) => {
        try {
            const params = {};
            if (continent) params.continent = continent;
            if (resourceType) params.resourceType = resourceType;
            const response = await axios.get('/api/shop', { params });
            return response.data;
        } catch (error) {
            console.error('Error fetching icons:', error);
            throw error;
        }
    },

    // Получить список континентов
    getContinents: async () => {
        try {
            const response = await axios.get('/api/shop/continents');
            return response.data;
        } catch (error) {
            console.error('Error fetching continents:', error);
            throw error;
        }
    },

    // Купить долю месторождения
    buyIcon: async (userId, iconId) => {
        try {
            const response = await axios.post('/api/shop/buy', { userId, iconId });
            return response.data;
        } catch (error) {
            console.error('Error buying icon:', error);
            throw error;
        }
    },

    // Получить купленные месторождения пользователя (по _id)
    getMyIcons: async (userId) => {
        try {
            const response = await axios.get(`/api/shop/my/${userId}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching user icons:', error);
            throw error;
        }
    },

    // Получить купленные месторождения пользователя (алиас для стейкинга — userId = _id)
    getUserIcons: async (userId) => {
        try {
            const response = await axios.get(`/api/shop/my/${userId}`);
            return response.data.userIcons || [];
        } catch (error) {
            console.error('Error fetching user icons:', error);
            return [];
        }
    },
};
