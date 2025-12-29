import { useState, useEffect } from 'react';

/**
 * Hook to track user location and calculate distance to a target.
 * Uses the Haversine formula for accuracy.
 */
export const useGeofencing = () => {
    const [userLocation, setUserLocation] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!navigator.geolocation) {
            setTimeout(() => setError("Geolocation not supported"), 0);
            return;
        }

        const watchId = navigator.geolocation.watchPosition(
            (position) => {
                setUserLocation({
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude,
                    accuracy: position.coords.accuracy
                });
            },
            (err) => setError(err.message),
            { enableHighAccuracy: true, maximumAge: 10000, timeout: 5000 }
        );

        return () => navigator.geolocation.clearWatch(watchId);
    }, []);

    const calculateDistance = (lat1, lon1, lat2, lon2) => {
        const toRad = (value) => (value * Math.PI) / 180;
        const R = 6371000; // Earth radius in meters

        const dLat = toRad(lat2 - lat1);
        const dLon = toRad(lon2 - lon1);

        const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);

        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c; // Distance in meters
    };

    const isWithinRange = (targetLat, targetLng, rangeMeters = 20) => {
        if (!userLocation) return false;
        const distance = calculateDistance(
            userLocation.latitude,
            userLocation.longitude,
            targetLat,
            targetLng
        );
        return distance <= rangeMeters;
    };

    return { userLocation, calculateDistance, isWithinRange, error };
};
