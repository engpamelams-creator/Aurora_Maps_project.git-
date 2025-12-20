import api from '@/config/api';

export const getMaps = async () => {
    const response = await api.get('/maps');
    // Laravel Resource Collection wraps in 'data'
    return response.data.data;
};

export const getMap = async (id) => {
    const response = await api.get(`/maps/${id}`);
    // Laravel Resource wraps in 'data'
    return response.data.data;
};

export const createMap = async (data) => {
    const response = await api.post('/maps', data);
    // Laravel Resource wraps in 'data'
    return response.data.data;
};

export const createPoint = async (mapId, data) => {
    const response = await api.post(`/maps/${mapId}/points`, data);
    return response.data; // Points might be simple JSON or Resource, let's verify controller if needed, but assuming simple for now or distinct
};

export const updatePoint = async (pointId, data) => {
    const response = await api.put(`/points/${pointId}`, data);
    return response.data;
};

export const deletePoint = async (pointId) => {
    await api.delete(`/points/${pointId}`);
};

export const deleteAllPoints = async (mapId) => {
    await api.delete(`/maps/${mapId}/points`);
};
