import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Activity, AlertTriangle, CloudRain, Zap } from 'lucide-react';
import { motion } from 'framer-motion';

export const AuroraForecast = () => {
    const [kpIndex, setKpIndex] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchSpaceWeather = async () => {
            try {
                // NOAA SWPC endpoint
                const response = await axios.get('https://services.swpc.noaa.gov/json/planetary_k_index_1m.json');
                if (response.data && response.data.length > 0) {
                    const latest = response.data[response.data.length - 1]; // Get the most recent reading
                    setKpIndex(latest.kp_index);
                }
            } catch (error) {
                console.error("NASA API Error:", error);
                setKpIndex(3); // Fallback mock value
            } finally {
                setLoading(false);
            }
        };

        fetchSpaceWeather();
    }, []);

    if (loading) return null;

    // Determination logic
    const isStorm = kpIndex >= 5;
    const isActive = kpIndex >= 4;

    // Gradient logic
    const gradient = isStorm
        ? "from-red-500 to-purple-600"
        : isActive
            ? "from-yellow-400 to-amber-600"
            : "from-green-400 to-emerald-600";

    const statusText = isStorm
        ? "Tempestade Geomagnética"
        : isActive
            ? "Atividade Moderada"
            : "Atividade Calma";

    const description = isStorm
        ? "Aurora visível em latitudes médias! Olhe para o sul."
        : "Condições normais da magnetosfera.";

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative overflow-hidden rounded-2xl p-1 bg-white/5 border border-white/10 backdrop-blur-md"
        >
            {/* NASA Badge */}
            <div className="absolute top-2 right-2 flex items-center gap-1 opacity-50">
                <span className="text-[10px] font-mono tracking-widest text-white">DATA: NOAA/SWPC</span>
            </div>

            <div className="p-4 flex items-center gap-4">
                {/* KP Indicator */}
                <div className={`w-16 h-16 rounded-xl flex items-center justify-center bg-gradient-to-br ${gradient} shadow-lg shadow-black/20 text-white`}>
                    <div className="text-center">
                        <span className="block text-xs font-bold opacity-80">KP</span>
                        <span className="text-3xl font-bold tracking-tighter">{Math.round(kpIndex)}</span>
                    </div>
                </div>

                {/* Text Info */}
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        {isStorm ? <Zap size={16} className="text-red-400 fill-current animate-pulse" /> : <Activity size={16} className="text-green-400" />}
                        <h3 className={`text-sm font-bold uppercase tracking-wide bg-clip-text text-transparent bg-gradient-to-r ${gradient}`}>
                            {statusText}
                        </h3>
                    </div>
                    <p className="text-xs text-text-muted max-w-[200px]">
                        {description}
                    </p>
                </div>
            </div>

            {/* Background Texture for "Tech" feel */}
            <div className="absolute inset-0 opacity-5 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:8px_8px] pointer-events-none"></div>
        </motion.div>
    );
};
