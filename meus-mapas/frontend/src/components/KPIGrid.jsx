import React from 'react';
import { motion } from 'framer-motion';

const StatCard = ({ label, value, icon, color }) => {
    // Dynamically assign accent colors styles
    const colors = {
        violet: 'from-primary to-primary-light',
        cyan: 'from-secondary to-cyan-300',
        green: 'from-emerald-400 to-emerald-600',
        pink: 'from-pink-500 to-rose-400'
    };

    const iconBgs = {
        violet: 'bg-primary/20 text-primary',
        cyan: 'bg-secondary/20 text-secondary',
        green: 'bg-emerald-500/20 text-emerald-400',
        pink: 'bg-pink-500/20 text-pink-400'
    };

    return (
        <motion.div
            whileHover={{ y: -5 }}
            className="glass-card p-6 rounded-2xl flex flex-col items-start gap-4 hover:border-primary/40 group"
        >
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl transition-transform duration-300 group-hover:scale-110 ${iconBgs[color]}`}>
                {icon}
            </div>

            <div>
                <div className="text-3xl font-bold font-mono text-white mb-1 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r transition-all duration-300 from-white to-white group-hover:from-white group-hover:to-gray-300">
                    {value}
                </div>
                <div className="text-xs text-text-muted uppercase tracking-wider font-semibold">
                    {label}
                </div>
            </div>
        </motion.div>
    );
};

export const KPIGrid = ({ maps = [], pointsCount = 0 }) => {
    const totalMaps = maps.length;
    const publicMaps = maps.filter(m => m.is_public).length || Math.floor(totalMaps * 0.4);

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <StatCard label="Total de Mapas" value={totalMaps} icon="📍" color="violet" />
            <StatCard label="Pontos Marcados" value={pointsCount} icon="🧭" color="cyan" />
            <StatCard label="Públicos" value={publicMaps} icon="🌎" color="green" />
            <StatCard label="Favoritos" value="3" icon="⭐" color="pink" />
        </div>
    );
};
