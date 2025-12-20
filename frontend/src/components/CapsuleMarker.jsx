import React, { useMemo } from 'react';
import { Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { ArrowDownCircleIcon } from '@heroicons/react/24/solid';

/**
 * A 3D-style CSS marker for the map.
 * Uses L.divIcon to render custom HTML.
 */
export const CapsuleMarker = ({ capsule, isCollectable, onCollect }) => {

    const icon = useMemo(() => {
        // Dynamic class based on state
        const pulseClass = isCollectable ? 'animate-bounce shadow-neon-green' : 'opacity-80';
        const colorClass = isCollectable ? 'bg-green-500' : 'bg-purple-600';

        return L.divIcon({
            className: 'custom-div-icon',
            html: `
                <div class="relative w-8 h-8">
                    <div class="absolute inset-0 ${colorClass} rounded-lg transform rotate-45 border-2 border-white shadow-lg ${pulseClass} flex items-center justify-center">
                        <span class="text-white text-xs font-bold">🎁</span>
                    </div>
                </div>
            `,
            iconSize: [32, 32],
            iconAnchor: [16, 32],
            popupAnchor: [0, -32]
        });
    }, [isCollectable]);

    return (
        <Marker position={[capsule.latitude, capsule.longitude]} icon={icon}>
            <Popup className="glass-popup">
                <div className="p-2 min-w-[200px] text-center">
                    <h3 className="font-bold text-lg text-secondary-400 mb-1">{capsule.title}</h3>
                    <p className="text-sm text-gray-300 mb-3">{capsule.message}</p>

                    {capsule.image_url && (
                        <img
                            src={capsule.image_url}
                            alt="Capsule Content"
                            className="w-full h-24 object-cover rounded-md mb-2 border border-gray-600"
                        />
                    )}

                    {isCollectable ? (
                        <button
                            onClick={() => onCollect(capsule.id)}
                            className="w-full bg-gradient-to-r from-green-400 to-emerald-600 text-white py-2 rounded-lg font-bold shadow-neon hover:scale-105 transition-transform"
                        >
                            🔓 ABRIR CÁPSULA
                        </button>
                    ) : (
                        <div className="text-xs text-gray-400 italic mt-2 flex items-center justify-center gap-1">
                            <ArrowDownCircleIcon className="w-4 h-4" />
                            Chegue mais perto para abrir ({Math.round(capsule.distance)}m)
                        </div>
                    )}
                </div>
            </Popup>
        </Marker>
    );
};
