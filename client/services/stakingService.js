import axios from 'axios';

export const stakingService = {
    // Поставить иконку в стейкинг
    stake: async (userId, iconId) => {
        try {
            const response = await axios.post('/api/staking/stake', { userId, iconId });
            return response.data;
        } catch (error) {
            console.error('Error staking icon:', error);
            throw error;
        }
    },

    // Снять иконку из стейкинга
    unstake: async (userId, stakedIconId) => {
        try {
            const response = await axios.post('/api/staking/unstake', { userId, iconId: stakedIconId });
            return response.data;
        } catch (error) {
            console.error('Error unstaking icon:', error);
            throw error;
        }
    },

    // Собрать пассивный доход (по userId — суммарно)
    claimRewards: async (userId, stakedIconId) => {
        try {
            const response = await axios.post('/api/staking/claim', { userId, stakedIconId });
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
            return { stakedIcons: response.data.stakes || [] };
        } catch (error) {
            console.error('Error fetching stakes:', error);
            return { stakedIcons: [] };
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
