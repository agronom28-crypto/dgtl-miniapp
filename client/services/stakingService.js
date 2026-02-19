import axios from 'axios';

export const stakingService = {
    // Поставить иконку в стейкинг
    stakeIcon: async (userId, iconId) => {
        try {
            const response = await axios.post('/api/staking/stake', { userId, iconId });
            return response.data;
        } catch (error) {
            console.error('Error staking icon:', error);
            throw error;
        }
    },

    // Снять иконку из стейкинга
    unstakeIcon: async (userId, iconId) => {
        try {
            const response = await axios.post('/api/staking/unstake', { userId, iconId });
            return response.data;
        } catch (error) {
            console.error('Error unstaking icon:', error);
            throw error;
        }
    },

    // Собрать пассивный доход
    claimEarnings: async (userId) => {
        try {
            const response = await axios.post('/api/staking/claim', { userId });
            return response.data;
        } catch (error) {
            console.error('Error claiming earnings:', error);
            throw error;
        }
    },

    // Получить активные стейки
    getActiveStakes: async (userId) => {
        try {
            const response = await axios.get(`/api/staking/active/${userId}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching stakes:', error);
            throw error;
        }
    },

    // Получить накопленный доход
    getEarnings: async (userId) => {
        try {
            const response = await axios.get(`/api/staking/earnings/${userId}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching earnings:', error);
            throw error;
        }
    }
};
