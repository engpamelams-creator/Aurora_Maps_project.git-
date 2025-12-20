import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Marker, Popup, useMapEvents } from 'react-leaflet';
import { AnimatePresence, motion } from 'framer-motion';
import { useMaps } from '@/features/maps/hooks/useMaps';
import { ArrowLeft, Trash2, Edit2, Save, X, MapPin, Wand2, Clock } from 'lucide-react';
import { AuroraMap } from '../components/AuroraMap';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

// Custom Neon Icon Definition
const createCustomIcon = () => {
    return L.divIcon({
        className: 'custom-marker-pin',
        html: `<div class="marker-glow"></div><div class="marker-dot"></div>`,
        iconSize: [32, 32],
        iconAnchor: [16, 16], // Center of the 32x32 div
        popupAnchor: [0, -16]
    });
};

const LocationMarker = ({ onLocationSelected }) => {
    useMapEvents({
        click(e) {
            onLocationSelected(e.latlng);
        },
    });
    return null;
};

const MapDetailPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { getMapById, addPoint, editPoint, removePoint, removeAllPoints } = useMaps();

    const [map, setMap] = useState(null);
    const [points, setPoints] = useState([]);
    const [loading, setLoading] = useState(true);
    const [modalOpen, setModalOpen] = useState(false);
    const [newPoint, setNewPoint] = useState({ name: '', latitude: 0, longitude: 0 });
    const [editingPointId, setEditingPointId] = useState(null);
    const [editName, setEditName] = useState('');

    // --- Route Generator State ---
    const [routeModalOpen, setRouteModalOpen] = useState(false);
    const [generatedRoute, setGeneratedRoute] = useState(null);
    const [availableTime, setAvailableTime] = useState('2h'); // 2h, 4h, Day

    useEffect(() => {
        fetchMapData();
    }, [id]);

    const fetchMapData = async () => {
        try {
            const data = await getMapById(id);
            setMap(data);
            setPoints(data.points || []);
        } catch (error) {
            console.error('Error fetching map:', error);
            navigate('/');
        } finally {
            setLoading(false);
        }
    };

    const handleMapClick = (latlng) => {
        setNewPoint({
            name: '',
            latitude: latlng.lat,
            longitude: latlng.lng
        });
        setModalOpen(true);
    };

    const handleSavePoint = async (e) => {
        e.preventDefault();
        try {
            const data = await addPoint(id, newPoint);
            setPoints([...points, data]);
            setModalOpen(false);
        } catch (error) {
            console.error('Error saving point:', error);
        }
    };

    const handleDeletePoint = async (pointId) => {
        if (!confirm('Excluir este ponto?')) return;
        try {
            await removePoint(pointId);
            setPoints(points.filter(p => p.id !== pointId));
        } catch (error) {
            console.error('Error deleting point:', error);
        }
    };

    const handleUpdatePoint = async (pointId) => {
        try {
            const data = await editPoint(pointId, { name: editName });
            setPoints(points.map(p => p.id === pointId ? data : p));
            setEditingPointId(null);
        } catch (error) {
            console.error('Error updating point:', error);
        }
    };

    const handleDeleteAll = async () => {
        if (!confirm('Excluir TODOS os pontos deste mapa? Isso não pode ser desfeito.')) return;
        try {
            await removeAllPoints(id);
            setPoints([]);
        } catch (error) {
            console.error('Error deleting all points:', error);
        }
    };

    // --- Route Generator Logic ---
    const handleGenerateRoute = () => {
        if (points.length < 2) {
            alert('Precisamos de pelo menos 2 pontos para criar um roteiro!');
            return;
        }
        // Simple heuristic: Shuffle and pick 3 random points
        const shuffled = [...points].sort(() => 0.5 - Math.random());
        const selected = shuffled.slice(0, 3);
        setGeneratedRoute(selected);
        setRouteModalOpen(false);
    };

    // Filter State
    const [activeFilters, setActiveFilters] = useState({
        ramp: false,
        pet: false,
        sensory: false
    });

    const filters = [
        { key: 'ramp', label: 'Acessível (Rampa)', icon: '♿' },
        { key: 'pet', label: 'Pet Friendly', icon: '🐾' },
        { key: 'sensory', label: 'Sensorial (Calmo)', icon: '🔇' },
    ];

    const toggleFilter = (key) => {
        setActiveFilters(prev => ({ ...prev, [key]: !prev[key] }));
    };

    // Filter Logic
    const filteredPoints = points.filter(point => {
        if (activeFilters.ramp && !point.has_ramp) return false;
        if (activeFilters.pet && !point.is_pet_friendly) return false;
        if (activeFilters.sensory && !point.is_sensory_friendly) return false;
        return true;
    });

    if (loading) return (
        <div className="min-h-screen bg-dark flex items-center justify-center">
            <div className="animate-pulse flex flex-col items-center">
                <div className="w-12 h-12 bg-primary/20 rounded-full mb-4"></div>
                <div className="text-white/50">Carregando mapa...</div>
            </div>
        </div>
    );

    if (!map) return null;

    return (
        <div className="min-h-screen bg-dark text-text flex flex-col">

            <div className="flex-1 flex flex-col md:flex-row gap-6 p-4 md:p-6 h-[calc(100vh-88px)]">
                {/* Sidebar */}
                <aside className="w-full md:w-[350px] bg-dark-card backdrop-blur-md border border-white/10 rounded-2xl flex flex-col overflow-hidden shadow-2xl relative">
                    <div className="p-6 border-b border-white/5">
                        <div className="flex items-center gap-3 mb-4">
                            <Link to="/" className="p-2 text-text-muted hover:text-white hover:bg-white/10 rounded-lg transition-colors">
                                <ArrowLeft size={20} />
                            </Link>
                            <div className="min-w-0">
                                <h1 className="text-xl font-bold text-white truncate">{map.name}</h1>
                                <p className="text-xs text-text-muted">ID: {map.id}</p>
                            </div>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-medium text-primary bg-primary/10 px-3 py-1 rounded-full border border-primary/20">
                                {filteredPoints.length} pontos disponíveis
                            </span>
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
                        {/* Accessibility Labels in List */}
                        {filteredPoints.length === 0 ? (
                            <div className="text-center py-10 px-4">
                                <div className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-3">
                                    <MapPin className="text-text-muted" size={20} />
                                </div>
                                <p className="text-sm text-text-muted">Nenhum ponto encontrado com este filtro.</p>
                            </div>
                        ) : (
                            filteredPoints.map(point => (
                                <div key={point.id} className="group p-4 rounded-xl bg-white/5 border border-transparent hover:border-primary/30 hover:bg-white/10 transition-all">
                                    <div className="flex justify-between items-start gap-3">
                                        <div className="flex-1 min-w-0">
                                            {editingPointId === point.id ? (
                                                <div className="flex flex-col gap-2">
                                                    <input
                                                        value={editName}
                                                        onChange={e => setEditName(e.target.value)}
                                                        className="w-full bg-dark border border-primary/50 text-white text-sm rounded px-2 py-1 outline-none"
                                                        autoFocus
                                                    />
                                                    <div className="flex gap-2 justify-end">
                                                        <button onClick={() => setEditingPointId(null)} className="p-1 text-text-muted hover:text-white"><X size={14} /></button>
                                                        <button onClick={() => handleUpdatePoint(point.id)} className="p-1 text-primary hover:text-primary-light"><Save size={14} /></button>
                                                    </div>
                                                </div>
                                            ) : (
                                                <>
                                                    <h3 className="font-medium text-white truncate flex items-center gap-2">
                                                        {point.name}
                                                        {/* Icon Badges */}
                                                        <div className="flex gap-1">
                                                            {point.has_ramp && <span title="Acessível" className="text-xs opacity-70 grayscale-0">♿</span>}
                                                            {point.is_pet_friendly && <span title="Pet Friendly" className="text-xs opacity-70 grayscale-0">🐾</span>}
                                                            {point.is_sensory_friendly && <span title="Sensorial Friendly" className="text-xs opacity-70 grayscale-0">🔇</span>}
                                                        </div>
                                                    </h3>
                                                    <p className="text-xs text-text-muted font-mono mt-1">
                                                        {Number(point.latitude).toFixed(4)}, {Number(point.longitude).toFixed(4)}
                                                    </p>
                                                    {point.description && <p className="text-xs text-text-muted/70 mt-1 line-clamp-1 italic">{point.description}</p>}
                                                </>
                                            )}
                                        </div>

                                        {editingPointId !== point.id && (
                                            <div className="flex gap-1 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                                                <button
                                                    onClick={() => { setEditingPointId(point.id); setEditName(point.name); }}
                                                    className="p-1.5 text-text-muted hover:text-white hover:bg-white/10 rounded transition"
                                                >
                                                    <Edit2 size={14} />
                                                </button>
                                                <button
                                                    onClick={() => handleDeletePoint(point.id)}
                                                    className="p-1.5 text-text-muted hover:text-danger hover:bg-danger/10 rounded transition"
                                                >
                                                    <Trash2 size={14} />
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))
                        )}
                    </div>

                    {points.length > 0 && (
                        <div className="p-4 border-t border-white/5 space-y-2">
                            <button
                                onClick={() => setRouteModalOpen(true)}
                                className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-primary to-secondary text-dark font-bold py-3 rounded-xl shadow-[0_0_20px_rgba(34,211,238,0.3)] hover:shadow-[0_0_30px_rgba(34,211,238,0.5)] transition-all transform hover:-translate-y-1"
                            >
                                <Wand2 size={18} /> Gerar Roteiro Express
                            </button>

                            <button
                                onClick={handleDeleteAll}
                                className="w-full flex items-center justify-center gap-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 py-2 rounded-xl text-xs font-medium transition-colors opacity-70 hover:opacity-100"
                            >
                                <Trash2 size={14} /> Limpar Mapa
                            </button>
                        </div>
                    )}

                    {/* Generated Route Display - Polished UI */}
                    <AnimatePresence>
                        {generatedRoute && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                className="absolute inset-0 z-[100] bg-[#0f172a] flex flex-col"
                            >
                                {/* Header with Gradient */}
                                <div className="p-6 bg-gradient-to-b from-primary/10 to-transparent border-b border-white/5">
                                    <div className="flex justify-between items-center mb-2">
                                        <div className="flex items-center gap-2 text-primary">
                                            <Wand2 size={24} className="animate-pulse" />
                                            <span className="text-xs font-bold uppercase tracking-wider">Roteiro Mágico</span>
                                        </div>
                                        <button
                                            onClick={() => setGeneratedRoute(null)}
                                            className="p-2 hover:bg-white/10 rounded-full text-white/50 hover:text-white transition"
                                        >
                                            <X size={20} />
                                        </button>
                                    </div>
                                    <h2 className="text-2xl font-bold text-white leading-tight">
                                        Seu Roteiro <br />
                                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
                                            {availableTime === 'Dia Top' ? 'para o Dia Todo' : `de ${availableTime}`}
                                        </span>
                                    </h2>
                                </div>

                                <div className="flex-1 overflow-y-auto p-6 space-y-8 relative custom-scrollbar">
                                    {/* Continuous Vertical Line */}
                                    <div className="absolute left-[39px] top-6 bottom-6 w-0.5 bg-gradient-to-b from-primary via-secondary to-primary/20"></div>

                                    {generatedRoute.map((point, index) => (
                                        <motion.div
                                            key={point.id}
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: index * 0.1 }}
                                            className="relative flex gap-5 group"
                                        >
                                            {/* Number Node */}
                                            <div className="relative z-10 w-8 h-8 rounded-full bg-dark border-2 border-primary flex items-center justify-center shrink-0 shadow-[0_0_15px_rgba(34,211,238,0.4)] group-hover:scale-110 transition-transform">
                                                <span className="text-white font-bold text-sm">{index + 1}</span>
                                            </div>

                                            {/* Content Card */}
                                            <div className="flex-1 bg-white/5 hover:bg-white/10 p-4 rounded-xl border border-white/5 hover:border-primary/30 transition-all group-hover:translate-x-1">
                                                <h3 className="font-bold text-lg text-white mb-1 leading-tight">{point.name}</h3>
                                                <div className="flex items-center gap-2 text-xs text-text-muted">
                                                    <Clock size={12} className="text-secondary" />
                                                    <span>
                                                        {index === 0 ? 'Ponto de Partida' : index === 1 ? '+ 45 min de trajeto' : '+ 30 min de trajeto'}
                                                    </span>
                                                </div>
                                                {/* Mini Tags */}
                                                <div className="flex gap-1 mt-3">
                                                    {point.has_ramp && <span className="text-[10px] bg-white/10 px-1.5 py-0.5 rounded text-white/70">Acessível</span>}
                                                    {point.is_pet_friendly && <span className="text-[10px] bg-white/10 px-1.5 py-0.5 rounded text-white/70">Pet</span>}
                                                </div>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>

                                {/* Footer */}
                                <div className="p-6 border-t border-white/10 bg-dark/50">
                                    <div className="flex justify-between items-center mb-4 text-sm">
                                        <span className="text-text-muted">Tempo Total Estimado</span>
                                        <span className="font-bold text-secondary text-lg">~2h 45min</span>
                                    </div>
                                    <button
                                        onClick={() => setGeneratedRoute(null)}
                                        className="w-full bg-white/10 hover:bg-white/20 text-white font-medium py-3.5 rounded-xl transition"
                                    >
                                        Fechar Roteiro
                                    </button>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </aside>

                {/* Map Area */}
                <main className="flex-1 flex flex-col rounded-2xl overflow-hidden border border-white/10 shadow-2xl relative min-h-[400px]">

                    {/* Accessibility Filter Bar */}
                    <div className="absolute top-4 left-1/2 -translate-x-1/2 z-[400] flex gap-2 w-full max-w-md justify-center px-4">
                        <div className="flex gap-2 p-1.5 bg-dark-card/90 backdrop-blur-md border border-white/10 rounded-full shadow-xl">
                            {filters.map(filter => (
                                <button
                                    key={filter.key}
                                    onClick={() => toggleFilter(filter.key)}
                                    className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all flex items-center gap-1.5 border ${activeFilters[filter.key]
                                        ? 'bg-primary/20 text-primary border-primary/30 shadow-[0_0_10px_rgba(124,58,237,0.3)]'
                                        : 'text-text-muted hover:bg-white/5 border-transparent'
                                        }`}
                                >
                                    <span>{filter.icon}</span>
                                    <span className="hidden sm:inline">{filter.label}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    <AuroraMap
                        center={points.length > 0 ? [points[0].latitude, points[0].longitude] : [-23.5505, -46.6333]}
                        zoom={13}
                        onLocationSelected={handleMapClick}
                    >
                        {filteredPoints.map(point => (
                            <Marker
                                key={point.id}
                                position={[point.latitude, point.longitude]}
                                icon={createCustomIcon()}
                            >
                                <Popup>
                                    <strong className="text-white">{point.name}</strong>
                                    <div className="flex gap-2 mt-1 mb-1">
                                        {point.has_ramp && <span className="bg-blue-500/20 text-blue-300 text-[10px] px-1.5 rounded border border-blue-500/30">Acessível</span>}
                                        {point.is_pet_friendly && <span className="bg-amber-500/20 text-amber-300 text-[10px] px-1.5 rounded border border-amber-500/30">Pet</span>}
                                        {point.is_sensory_friendly && <span className="bg-purple-500/20 text-purple-300 text-[10px] px-1.5 rounded border border-purple-500/30">Calmo</span>}
                                    </div>
                                    <span className="text-xs text-text-muted block mt-1">{point.description || "Sem descrição"}</span>
                                </Popup>
                            </Marker>
                        ))}
                    </AuroraMap>

                    {/* Floating Info */}
                    <div className="absolute top-4 right-4 z-[400] bg-dark-card/80 backdrop-blur px-4 py-2 rounded-lg border border-white/10 text-xs text-white/50 pointer-events-none hidden md:block">
                        Clique no mapa para criar • Arraste para mover
                    </div>
                </main>
            </div>

            {/* Create Point Modal */}
            <AnimatePresence>
                {modalOpen && (
                    <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
                        <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setModalOpen(false)} />

                        <div className="relative w-full max-w-sm bg-dark-lighter border border-white/10 rounded-2xl shadow-2xl overflow-hidden p-6">
                            <h3 className="text-lg font-bold text-white mb-1">Novo Ponto</h3>
                            <p className="text-xs text-text-muted font-mono mb-6">
                                {newPoint.latitude.toFixed(6)}, {newPoint.longitude.toFixed(6)}
                            </p>

                            <form onSubmit={handleSavePoint}>
                                <div className="mb-6">
                                    <label className="block text-xs uppercase tracking-wider text-text-muted mb-2 font-bold">Nome do Local</label>
                                    <input
                                        value={newPoint.name}
                                        onChange={e => setNewPoint({ ...newPoint, name: e.target.value })}
                                        className="w-full bg-dark border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-gray-600 focus:outline-none focus:border-primary transition"
                                        placeholder="Ex: Minha Casa"
                                        autoFocus
                                    />
                                </div>
                                <div className="flex gap-3">
                                    <button
                                        type="button"
                                        onClick={() => setModalOpen(false)}
                                        className="flex-1 px-4 py-2.5 rounded-xl font-medium text-text-muted hover:bg-white/5 hover:text-white transition"
                                    >
                                        Cancelar
                                    </button>
                                    <button
                                        type="submit"
                                        className="flex-1 bg-primary hover:bg-primary-hover text-white px-4 py-2.5 rounded-xl font-medium shadow-lg shadow-purple-900/20 transition"
                                    >
                                        Salvar
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </AnimatePresence>

            {/* Route Generator Modal */}
            <AnimatePresence>
                {routeModalOpen && (
                    <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
                        <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setRouteModalOpen(false)} />

                        <div className="relative w-full max-w-sm bg-dark-lighter border-2 border-primary/30 rounded-2xl shadow-[0_0_50px_rgba(34,211,238,0.2)] overflow-hidden p-6 animate-fade-in-up">
                            <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse-slow">
                                <Wand2 size={32} className="text-primary" />
                            </div>

                            <h3 className="text-2xl font-bold text-white text-center mb-2">Criar Roteiro Mágico</h3>
                            <p className="text-sm text-text-muted text-center mb-6">
                                A IA da Aurora vai escolher a melhor sequência de visita para seus pontos. Quanto tempo você tem?
                            </p>

                            <div className="grid grid-cols-3 gap-3 mb-6">
                                {['2h', '4h', 'Dia Top'].map(time => (
                                    <button
                                        key={time}
                                        onClick={() => setAvailableTime(time)}
                                        className={`py-3 rounded-xl text-sm font-bold border transition ${availableTime === time
                                            ? 'bg-primary text-dark border-primary'
                                            : 'bg-dark/50 text-text-muted border-white/10 hover:border-white/30'}`}
                                    >
                                        {time}
                                    </button>
                                ))}
                            </div>

                            <button
                                onClick={handleGenerateRoute}
                                className="w-full bg-gradient-to-r from-primary to-secondary text-dark font-bold py-3.5 rounded-xl shadow-lg hover:brightness-110 transition active:scale-95"
                            >
                                Gerar Roteiro Agora
                            </button>
                        </div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default MapDetailPage;
