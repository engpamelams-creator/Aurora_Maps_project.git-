import api from '../config/api';

// Enhanced Error Handler for Fluid Integration
const handleServiceError = (error, context) => {
    // Log for developers
    console.warn(`[SocialService] Error in ${context}:`, error);

    // User-friendly fallback or rethrow
    if (error.response) {
        // Server responded with error
        const message = error.response.data?.message || 'Erro ao comunicar com o servidor social.';
        throw new Error(message);
    } else if (error.request) {
        // Network error
        throw new Error('Sem conexão com a Aurora Network. Verifique sua internet.');
    } else {
        throw error;
    }
};

export const socialService = {
    // Get the main feed (paginated)
    getFeed: async (page = 1) => {
        try {
            const response = await api.get(`/feed?page=${page}`);
            return response.data;
        } catch (error) {
            handleServiceError(error, 'getFeed');
        }
    },

    // Create a new post
    createPost: async (postData) => {
        try {
            const response = await api.post('/posts', postData);
            return response.data;
        } catch (error) {
            handleServiceError(error, 'createPost');
        }
    },

    // Like or Unlike a post
    toggleLike: async (postId) => {
        try {
            const response = await api.post(`/posts/${postId}/like`);
            return response.data;
        } catch (error) {
            handleServiceError(error, 'toggleLike');
        }
    }
};
