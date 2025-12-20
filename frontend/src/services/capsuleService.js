import api from '@/config/api';

export const capsuleService = {
    // Fetch capsules near a location
    getAll: async (lat, lng) => {
        const response = await api.get(`/capsules?lat=${lat}&lng=${lng}`);
        return response.data;
    },

    // Create a new drop
    create: async (data) => {
        const response = await api.post('/capsules', data);
        return response.data;
    },

    // Collect a capsule
    collect: async (id, userLat, userLng) => {
        const response = await api.post(`/capsules/${id}/collect`, {
            lat: userLat,
            lng: userLng
        });
        return response.data;
    }
};
