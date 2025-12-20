import React, { useEffect, useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { useMaps } from '@/features/maps/hooks/useMaps';
import MapCard from '../components/MapCard';
import { MapSkeleton } from '../components/MapSkeleton'; // Added Skeleton
import { KPIGrid } from '../components/KPIGrid';
import { WeatherWidget } from '../components/WeatherWidget';
import { AuroraBackground } from '../components/AuroraBackground';
import { Loader2, X, AlertOctagon, RefreshCw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const MapListPage = () => {
    const { searchTerm } = useOutletContext() || { searchTerm: '' };
    const { maps, loading: isLoading, error: errorState, fetchMaps, createMap } = useMaps(); // Renamed to match existing usage or update below
    const [newMapName, setNewMapName] = useState('');
    const [isCreatingMap, setIsCreatingMap] = useState(false);

    useEffect(() => {
        // useMaps handles initial fetch, but we might want to refetch on mount if needed or rely on hook
        // The hook calls fetchMaps on mount.

        // Listen for global create event from Header
        const handleOpenModal = () => setIsCreatingMap(true);
        window.addEventListener('open-create-map-modal', handleOpenModal);
        return () => window.removeEventListener('open-create-map-modal', handleOpenModal);
    }, []);

    const handleCreateMap = async (e) => {
        e.preventDefault();
        if (!newMapName.trim()) return;

        try {
            await createMap({ name: newMapName });
            setNewMapName('');
            setIsCreatingMap(false);
        } catch (err) {
            console.error('Erro ao criar mapa:', err);
        }
    };

    // Animation Variants
    const containerVariants = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
                delayChildren: 0.3
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0 }
    };

    const filteredMaps = maps.filter(map =>
        map.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const totalPoints = maps.reduce((acc, map) => acc + (map.points_count || 0), 0);

    const curatedMaps = filteredMaps.filter(m => m.is_curated);
    const userMaps = filteredMaps.filter(m => !m.is_curated);

    return (
        <div className="min-h-screen text-slate-900 dark:text-white selection:bg-cyan-500/30 selection:text-white relative bg-transparent">
            {/* Note: AuroraBackground depends on context, but here it is redundant if BackgroundWrapper handles it. 
                However, MapListPage has specific AuroraBackground usage. Let's keep it but ensure z-index is correct.
             */}
            <AuroraBackground />

            {/* Header moved to Layout */}

            <main className="max-w-[1600px] mx-auto px-6 lg:px-12 py-12 relative z-10">
                {/* Top Row: Title + Space Forecast (Asymmetric Layout) */}
                <div className="flex flex-col lg:flex-row items-end lg:items-center justify-between mb-16 gap-8">
                    <div className="max-w-2xl">
                        <motion.h1
                            initial={{ opacity: 0, x: -30 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.4, ease: "easeOut" }}
                            className="text-5xl md:text-6xl font-bold text-white tracking-tight mb-4 leading-tight font-display"
                        >
                            Explore os <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-light to-secondary">Mapas de Aurora</span>
                        </motion.h1>
                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.1, duration: 0.4 }}
                            className="text-lg text-text-muted font-light leading-relaxed"
                        >
                            Descubra destinos curados por especialistas ou crie seus próprios mapas. Sua jornada começa aqui.
                        </motion.p>
                    </div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.2 }}
                        className="w-full lg:w-auto"
                    >
                        <WeatherWidget />
                    </motion.div>
                </div>

                {/* KPI Section with Skeleton or Data */}
                {isLoading ? (
                    <div className="mb-20 grid grid-cols-1 md:grid-cols-3 gap-6 animate-pulse">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="h-32 bg-white/5 rounded-2xl border border-white/10" />
                        ))}
                    </div>
                ) : !errorState && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="mb-20"
                    >
                        <KPIGrid maps={maps} pointsCount={totalPoints} />
                    </motion.div>
                )}

                {/* 🌟 Curated Maps Section */}
                {isLoading ? (
                    <div className="mb-24">
                        <div className="flex items-center gap-3 mb-10 pl-2 border-l-4 border-slate-700/50">
                            <div className="h-8 w-48 bg-slate-700/50 rounded-lg animate-pulse" />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                            {[1, 2, 3, 4].map(i => <MapSkeleton key={i} />)}
                        </div>
                    </div>
                ) : !errorState && curatedMaps.length > 0 && (
                    <div className="mb-24">
                        <div className="flex items-center gap-3 mb-10 pl-2 border-l-4 border-primary/50">
                            <h2 className="text-3xl font-bold text-white tracking-tight font-display">Experiências Aurora</h2>
                            <span className="bg-primary/20 text-primary px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border border-primary/20">Curadoria Oficial</span>
                        </div>

                        <motion.div
                            variants={containerVariants}
                            initial="hidden"
                            animate="show"
                            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
                        >
                            <AnimatePresence>
                                {curatedMaps.map(map => (
                                    <motion.div key={map.id} variants={itemVariants} layout className="h-full">
                                        <MapCard map={map} />
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </motion.div>
                    </div>
                )}

                {/* 👤 User Maps Section */}
                {isLoading ? (
                    <div>
                        <div className="flex items-center justify-between mb-10 pl-2 border-l-4 border-slate-700/50">
                            <div className="h-8 w-48 bg-slate-700/50 rounded-lg animate-pulse" />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                            {[1, 2, 3, 4].map(i => <MapSkeleton key={i} />)}
                        </div>
                    </div>
                ) : !errorState && (
                    <div>
                        <div className="flex items-center justify-between mb-10 pl-2 border-l-4 border-secondary/50">
                            <h2 className="text-3xl font-bold text-white tracking-tight font-display">Seus Mapas</h2>
                            {userMaps.length === 0 && (
                                <button
                                    onClick={() => setIsCreatingMap(true)}
                                    className="text-primary hover:text-white text-sm font-medium transition-all hover:translate-x-1"
                                >
                                    Criar novo mapa →
                                </button>
                            )}
                        </div>

                        {userMaps.length > 0 ? (
                            <motion.div
                                variants={containerVariants}
                                initial="hidden"
                                animate="show"
                                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
                            >
                                <AnimatePresence>
                                    {userMaps.map(map => (
                                        <motion.div key={map.id} variants={itemVariants} layout className="h-full">
                                            <MapCard map={map} />
                                        </motion.div>
                                    ))}
                                </AnimatePresence>
                            </motion.div>
                        ) : (
                            /* Empty State */
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="text-center py-24 glass-card rounded-3xl border border-white/5 border-dashed relative overflow-hidden group"
                            >
                                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                                <div className="relative z-10">
                                    <div className="inline-block p-6 rounded-full bg-white/5 mb-6 group-hover:scale-110 transition-transform duration-500">
                                        <span className="text-4xl filter drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]">🗺️</span>
                                    </div>
                                    <h3 className="text-2xl font-bold text-white mb-2">Sua jornada começa agora</h3>
                                    <p className="text-text-muted mb-8 max-w-md mx-auto">Você ainda não criou nenhum mapa. Use nossa ferramenta para marcar seus lugares favoritos no universo.</p>

                                    <button
                                        onClick={() => setIsCreatingMap(true)}
                                        className="bg-primary hover:bg-primary-hover text-white px-8 py-4 rounded-xl font-bold transition-all shadow-[0_0_20px_rgba(124,58,237,0.3)] hover:shadow-[0_0_40px_rgba(124,58,237,0.5)] hover:-translate-y-1"
                                    >
                                        Criar Primeiro Mapa
                                    </button>
                                </div>
                            </motion.div>
                        )}
                    </div>
                )}

                {/* Footer simple space */}
                <div className="h-32"></div>
            </main>

            {/* Create Modal */}
            <AnimatePresence>
                {isCreatingMap && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-black/80 backdrop-blur-md"
                            onClick={() => setIsCreatingMap(false)}
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="relative w-full max-w-md glass-card border border-white/10 rounded-3xl shadow-2xl overflow-hidden"
                        >
                            <div className="p-8 border-b border-white/5 flex justify-between items-center bg-white/5">
                                <h2 className="text-2xl font-bold text-white font-display">Novo Destino</h2>
                                <button onClick={() => setIsCreatingMap(false)} className="text-text-muted hover:text-white transition w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/10">
                                    <X size={20} />
                                </button>
                            </div>

                            <form onSubmit={handleCreateMap} className="p-8">
                                <div className="mb-8">
                                    <label className="block text-sm font-medium text-text-muted mb-3 uppercase tracking-wider">Nome do Mapa</label>
                                    <input
                                        type="text"
                                        value={newMapName}
                                        onChange={(e) => setNewMapName(e.target.value)}
                                        placeholder="Ex: Expedição Lunar 2024"
                                        className="w-full bg-black/20 border border-white/10 rounded-xl px-5 py-4 text-white placeholder:text-gray-600 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all text-lg"
                                    />
                                </div>
                                <div className="flex gap-4">
                                    <button
                                        type="button"
                                        onClick={() => setIsCreatingMap(false)}
                                        className="flex-1 px-6 py-4 rounded-xl font-medium text-text-muted hover:bg-white/5 hover:text-white transition"
                                    >
                                        Cancelar
                                    </button>
                                    <button
                                        type="submit"
                                        className="flex-1 bg-gradient-to-r from-primary to-primary-hover text-white px-6 py-4 rounded-xl font-bold shadow-lg shadow-primary/20 transition-transform hover:scale-[1.02] active:scale-[0.98]"
                                    >
                                        Criar Mapa
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default MapListPage;
