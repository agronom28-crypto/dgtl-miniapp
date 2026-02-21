import axios from 'axios';

export const stakingService = {
    // Поставить долю в стейкинг
    stake: async (userId, iconId) => {
        try {
            const response = await axios.post('/api/staking/stake', { userId, iconId });
            return response.data;
        } catch (error) {
            console.error('Error staking icon:', error);
            throw error;
        }
    },

    // Снять долю из стейкинга (по _id записи стейка)
    unstake: async (userId, stakedIconId) => {
        try {
            const response = await axios.post('/api/staking/unstake', { userId, stakedIconId });
            return response.data;
        } catch (error) {
            console.error('Error unstaking icon:', error);
            throw error;
        }
    },

    // Собрать пассивный доход (все активные стейки)
    claimRewards: async (userId) => {
        try {
            const response = await axios.post('/api/staking/claim', { userId });
            return response.data;
        } catch (error) {
            console.error('Error claiming rewards:', error);
            throw error;
        }
    },

    // Получить активные стейки пользователя
    getUserStaking: async (userId) => {
        try {
            const response = await axios.get(`/api/staking/active/${userId}`);
            return { stakedIcons: response.data.stakedIcons || [] };
        } catch (error) {
            console.error('Error fetching stakes:', error);
            return { stakedIcons: [] };
        }
    },

    // Получить накопленный доход (без сбора)
    getEarnings: async (userId) => {
        try {
            const response = await axios.get(`/api/staking/earnings/${userId}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching earnings:', error);
            return { pendingEarnings: 0, activeStakes: 0 };
        }
    },
};
