import { useState, useCallback, useEffect } from 'react';
import {
    getMaps,
    getMap as getMapService,
    createMap as createMapService,
    createPoint as createPointService,
    updatePoint as updatePointService,
    deletePoint as deletePointService,
    deleteAllPoints as deleteAllPointsService
} from '@/features/maps/services/mapService';

export const useMaps = () => {
    const [maps, setMaps] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchMaps = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await getMaps();
            console.log("useMaps fetched:", data);
            setMaps(Array.isArray(data) ? data : []);
        } catch (err) {
            console.error("Error fetching maps:", err);
            setError('Falha ao carregar mapas.');
        } finally {
            setLoading(false);
        }
    }, []);

    const createMap = useCallback(async (mapData) => {
        setLoading(true);
        try {
            const newMap = await createMapService(mapData);
            setMaps(prev => [newMap, ...prev]);
            return newMap;
        } catch (err) {
            console.error("Error creating map:", err);
            setError('Erro ao criar mapa.');
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    const getMapById = useCallback(async (id) => {
        setLoading(true);
        try {
            const map = await getMapService(id);
            return map;
        } catch (err) {
            console.error("Error fetching map:", err);
            setError('Falha ao carregar mapa.');
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    const addPoint = useCallback(async (mapId, pointData) => {
        try {
            const newPoint = await createPointService(mapId, pointData);
            return newPoint;
        } catch (err) {
            console.error("Error creating point:", err);
            throw err;
        }
    }, []);

    const editPoint = useCallback(async (pointId, data) => {
        try {
            const updated = await updatePointService(pointId, data);
            return updated;
        } catch (err) {
            console.error("Error updating point:", err);
            throw err;
        }
    }, []);

    const removePoint = useCallback(async (pointId) => {
        try {
            await deletePointService(pointId);
        } catch (err) {
            console.error("Error deleting point:", err);
            throw err;
        }
    }, []);

    const removeAllPoints = useCallback(async (mapId) => {
        try {
            await deleteAllPointsService(mapId);
        } catch (err) {
            console.error("Error clearing map:", err);
            throw err;
        }
    }, []);

    // Initial fetch
    useEffect(() => {
        fetchMaps();
    }, [fetchMaps]);

    return {
        maps,
        loading,
        error,
        fetchMaps,
        createMap,
        getMapById,
        addPoint,
        editPoint,
        removePoint,
        removeAllPoints
    };
};
