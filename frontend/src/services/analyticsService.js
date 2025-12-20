import api from '@/config/api';

export const logSearch = async (query) => {
    if (!query) return;
    try {
        await api.post('/analytics/search', { query });
    } catch (error) {
        console.warn('Analytics Error:', error);
    }
};
