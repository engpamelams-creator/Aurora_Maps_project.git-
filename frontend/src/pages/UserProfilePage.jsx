import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Save, Camera, Activity, Calendar, Zap, Loader2
} from 'lucide-react';
import {
    Map as MapIcon, Globe, Trophy, Star, Settings, Award
} from 'lucide-react';
import Feed from '../components/Feed';

const UserProfilePage = () => {
    const { user, updateProfile, updateAvatar } = useAuth();
    const [activeTab, setActiveTab] = useState('overview'); // overview, trips, badges, settings
    const fileInputRef = useRef(null);
    const [avatarPreview, setAvatarPreview] = useState(null);

    // --- Legacy Logic for Settings Tab ---
    const [formData, setFormData] = useState({ name: '', email: '', password: '', password_confirmation: '' });
    const [status, setStatus] = useState({ type: '', message: '' });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (user) {
            setFormData(prev => ({ ...prev, name: user.name, email: user.email }));
        }
    }, [user]);

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleUpdate = async (e) => {
        e.preventDefault();
        setStatus({ type: '', message: '' });
        setLoading(true);

        if (formData.password && formData.password !== formData.password_confirmation) {
            setLoading(false);
            return setStatus({ type: 'error', message: 'Senhas não conferem.' });
        }

        try {
            const dataToUpdate = {};
            if (formData.name !== user.name) dataToUpdate.name = formData.name;
            if (formData.email !== user.email) dataToUpdate.email = formData.email;
            if (formData.password) {
                dataToUpdate.password = formData.password;
                dataToUpdate.password_confirmation = formData.password_confirmation;
            }
            if (Object.keys(dataToUpdate).length === 0) {
                setLoading(false);
                return;
            }

            await updateProfile(dataToUpdate);
            setStatus({ type: 'success', message: 'Perfil atualizado com sucesso!' });
            setFormData(prev => ({ ...prev, password: '', password_confirmation: '' }));
        } catch (err) {
            console.error(err);
            setStatus({ type: 'error', message: err.response?.data?.message || 'Erro ao atualizar perfil.' });
        } finally {
            setLoading(false);
        }
    };

    // --- New Features: Avatar Upload ---
    const handleImageClick = () => {
        fileInputRef.current.click();
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const result = reader.result;
                setAvatarPreview(result);
                updateAvatar(result); // Persist globally
            };
            reader.readAsDataURL(file);
        }
    };

    // --- Mock Gamification Data ---
    const level = 12;
    const currentXP = 7500;
    const nextLevelXP = 10000;
    const progress = (currentXP / nextLevelXP) * 100;

    const stats = [
        { label: 'Mapas Criados', value: '12', icon: MapIcon, color: 'text-cyan-400', bg: 'bg-cyan-500/10', border: 'border-cyan-500/20' },
        { label: 'Países Visitados', value: '5', icon: Globe, color: 'text-purple-400', bg: 'bg-purple-500/10', border: 'border-purple-500/20' },
        { label: 'Conquistas', value: '8', icon: Trophy, color: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/20' },
        { label: 'Dias Viajando', value: '42', icon: Calendar, color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20' },
    ];

    const travelDNA = [
        { type: 'Natureza', percentage: 65, color: 'bg-emerald-500' },
        { type: 'Urbano', percentage: 25, color: 'bg-cyan-500' },
        { type: 'Cultura', percentage: 10, color: 'bg-purple-500' }
    ];

    return (
        <div className="min-h-screen relative font-sans text-slate-100 p-4 md:p-8 pb-32">

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="relative z-10 max-w-6xl mx-auto"
            >
                {/* --- GAMIFIED HEADER --- */}
                <div className="relative mb-12 group">
                    {/* Background Banner Effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-slate-900 to-slate-800 rounded-3xl border border-white/10 overflow-hidden">
                        <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-purple-900/40 to-transparent"></div>
                        {/* Stars/Dots Effect */}
                        <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.1) 1px, transparent 1px)', backgroundSize: '20px 20px', opacity: 0.2 }}></div>
                    </div>

                    <div className="relative p-8 md:p-10 flex flex-col md:flex-row items-center gap-8 z-10">
                        {/* Avatar Circle with Progress Ring */}
                        <div className="relative">
                            <div className="w-36 h-36 rounded-full relative flex items-center justify-center">
                                {/* Animated Progress Ring */}
                                <svg className="absolute inset-0 w-full h-full -rotate-90">
                                    <circle cx="72" cy="72" r="70" stroke="rgba(255,255,255,0.1)" strokeWidth="4" fill="none" />
                                    <circle
                                        cx="72" cy="72" r="70"
                                        stroke="url(#gradient)"
                                        strokeWidth="4"
                                        fill="none"
                                        strokeDasharray="440"
                                        strokeDashoffset={440 - (440 * progress) / 100}
                                        strokeLinecap="round"
                                        className="transition-all duration-1000 ease-out"
                                    />
                                    <defs>
                                        <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                                            <stop offset="0%" stopColor="#22d3ee" />
                                            <stop offset="100%" stopColor="#a855f7" />
                                        </linearGradient>
                                    </defs>
                                </svg>

                                {/* Image Container */}
                                <div
                                    className="w-32 h-32 rounded-full overflow-hidden border-4 border-slate-900 cursor-pointer group hover:opacity-90 transition-opacity"
                                    onClick={handleImageClick}
                                >
                                    {avatarPreview ? (
                                        <img src={avatarPreview} alt="Avatar" className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full bg-slate-800 flex items-center justify-center text-3xl font-bold">
                                            {user?.name?.charAt(0)}
                                        </div>
                                    )}
                                </div>

                                {/* Camera Icon Overlay */}
                                <button
                                    onClick={handleImageClick}
                                    className="absolute bottom-1 right-1 bg-slate-800 p-2 rounded-full border border-white/20 text-cyan-400 hover:bg-slate-700 transition-colors shadow-lg"
                                >
                                    <Camera size={16} />
                                </button>
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    className="hidden"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                />
                            </div>
                        </div>

                        {/* User Info */}
                        <div className="flex-1 text-center md:text-left">
                            <div className="flex flex-col md:flex-row items-center gap-3 mb-2">
                                <h1 className="text-4xl font-bold text-white tracking-tight">{user?.name}</h1>
                                <div className="px-3 py-1 rounded-full bg-amber-500/20 border border-amber-500/30 text-amber-400 text-xs font-bold uppercase tracking-wider flex items-center gap-1 shadow-[0_0_15px_rgba(245,158,11,0.2)]">
                                    <Star size={12} fill="currentColor" /> Pro Traveler
                                </div>
                            </div>
                            <p className="text-slate-400 text-lg mb-6">Explorando o mundo, um mapa de cada vez.</p>

                            {/* Level Bar */}
                            <div className="max-w-md bg-slate-800/50 rounded-full h-4 mb-2 overflow-hidden border border-white/5 relative group">
                                <div
                                    className="h-full bg-gradient-to-r from-cyan-500 to-purple-600 relative overflow-hidden"
                                    style={{ width: `${progress}%` }}
                                >
                                    <div className="absolute inset-0 bg-white/20 w-full animate-[shimmer_2s_infinite]"></div>
                                </div>
                            </div>
                            <div className="flex justify-between max-w-md text-xs font-bold text-slate-500 uppercase tracking-widest">
                                <span>Lvl {level}</span>
                                <span>{currentXP} / {nextLevelXP} XP</span>
                            </div>
                        </div>

                        {/* Quick Actions */}
                        <div className="flex flex-col gap-3">
                            <div className="flex items-center gap-2">
                                <span className="text-3xl font-bold text-white">12</span>
                                <span className="text-xs text-slate-500 uppercase w-20">Mapas Criados</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="text-3xl font-bold text-white">89</span>
                                <span className="text-xs text-slate-500 uppercase w-20">Conquistas</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* --- NAVIGATION TABS --- */}
                <div className="flex overflow-x-auto gap-2 mb-8 p-1 bg-slate-900/50 backdrop-blur-md rounded-2xl border border-white/5 w-fit mx-auto md:mx-0">
                    {[
                        { id: 'overview', label: 'Visão Geral', icon: Activity },
                        { id: 'trips', label: 'Minhas Viagens', icon: MapIcon },
                        { id: 'badges', label: 'Conquistas', icon: Trophy },
                        { id: 'settings', label: 'Configurações', icon: Settings },
                    ].map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl transition-all font-medium text-sm ${activeTab === tab.id
                                ? 'bg-white/10 text-white shadow-lg ring-1 ring-white/10'
                                : 'text-slate-400 hover:text-white hover:bg-white/5'
                                }`}
                        >
                            <tab.icon size={16} />
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* --- CONTENT AREA --- */}
                <AnimatePresence mode="wait">
                    {/* OVERVIEW TAB */}
                    {activeTab === 'overview' && (
                        <motion.div
                            key="overview"
                            initial={{ opacity: 0, scale: 0.98 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.98 }}
                            className="space-y-8"
                        >
                            {/* Stats Cards */}
                            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                                {stats.map((stat, idx) => (
                                    <div key={idx} className={`p-6 rounded-2xl border ${stat.border} ${stat.bg} backdrop-blur-sm relative overflow-hidden group`}>
                                        <div className="absolute top-0 right-0 p-4 opacity-50">
                                            <stat.icon size={40} className={`text-white/10 group-hover:scale-110 transition-transform duration-500`} />
                                        </div>
                                        <div className="relative z-10">
                                            <div className={`text-4xl font-bold text-white mb-1`}>{stat.value}</div>
                                            <div className={`text-xs uppercase tracking-widest font-bold ${stat.color}`}>{stat.label}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                                {/* Left Col: Feed */}
                                <div className="lg:col-span-2">
                                    <h3 className="font-bold text-lg mb-4 flex items-center gap-2 text-white">
                                        <Zap className="text-yellow-400" size={18} /> Atividade Recente
                                    </h3>
                                    <Feed />
                                </div>

                                {/* Right Col: Side Widgets */}
                                <div className="space-y-6">
                                    {/* Travel DNA Widget */}
                                    <div className="bg-slate-900/60 border border-white/10 p-6 rounded-3xl backdrop-blur-md">
                                        <h3 className="font-bold text-white mb-6 flex items-center gap-2">
                                            <Activity className="text-cyan-400" size={18} /> Travel DNA
                                        </h3>
                                        <div className="space-y-4">
                                            {travelDNA.map((item, idx) => (
                                                <div key={idx}>
                                                    <div className="flex justify-between text-xs text-slate-400 mb-1">
                                                        <span>{item.type}</span>
                                                        <span>{item.percentage}%</span>
                                                    </div>
                                                    <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                                                        <motion.div
                                                            initial={{ width: 0 }}
                                                            animate={{ width: `${item.percentage}%` }}
                                                            transition={{ duration: 1, delay: 0.5 }}
                                                            className={`h-full ${item.color}`}
                                                        />
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                        <div className="mt-6 pt-4 border-t border-white/5 text-center">
                                            <p className="text-xs text-slate-500">Baseado nos seus últimos 12 mapas de viagem.</p>
                                        </div>
                                    </div>

                                    {/* Next Adventure */}
                                    <div className="relative overflow-hidden group rounded-3xl h-48 cursor-pointer">
                                        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1552832230-c0197dd311b5?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80')] bg-cover bg-center transition-transform duration-700 group-hover:scale-110"></div>
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                                        <div className="absolute bottom-6 left-6 text-white z-10">
                                            <div className="flex items-center gap-2 text-xs font-bold text-purple-400 uppercase tracking-wider mb-1">
                                                <Globe size={12} /> Próxima Parada
                                            </div>
                                            <h3 className="text-2xl font-bold">Roma, Itália</h3>
                                            <p className="text-sm text-slate-300 mt-1">Faltam 12 dias</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {/* BADGES TAB */}
                    {activeTab === 'badges' && (
                        <motion.div
                            key="badges"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="grid grid-cols-2 md:grid-cols-4 gap-6"
                        >
                            {[
                                { title: "Pioneiro", desc: "Criou o primeiro mapa", color: "text-amber-400", unlocked: true },
                                { title: "Social", desc: "50 seguidores", color: "text-blue-400", unlocked: true },
                                { title: "Fotógrafo", desc: "100 fotos enviadas", color: "text-purple-400", unlocked: true },
                                { title: "Explorador", desc: "Visitou 5 países", color: "text-emerald-400", unlocked: true },
                                { title: "Lenda", desc: "Nível 50", color: "text-slate-600", unlocked: false },
                                { title: "Influencer", desc: "1k seguidores", color: "text-slate-600", unlocked: false },
                                { title: "Nômade", desc: "1 ano viajando", color: "text-slate-600", unlocked: false },
                                { title: "VIP", desc: "Assinante Aurora+", color: "text-slate-600", unlocked: false },
                            ].map((badge, i) => (
                                <div key={i} className={`glass-card p-6 rounded-2xl border ${badge.unlocked ? `border-${badge.color.split('-')[1]}-500/30 bg-${badge.color.split('-')[1]}-500/5` : 'border-white/5 bg-slate-900/50'} flex flex-col items-center text-center gap-4 group hover:-translate-y-1 transition-transform`}>
                                    <div className={`w-16 h-16 rounded-full flex items-center justify-center ${badge.unlocked ? 'bg-gradient-to-br from-white/10 to-transparent shadow-lg text-white' : 'bg-slate-800 text-slate-600 grayscale'}`}>
                                        <Award size={32} className={`${badge.unlocked ? badge.color : ''}`} />
                                    </div>
                                    <div>
                                        <h4 className={`font-bold font-display ${badge.unlocked ? 'text-white' : 'text-slate-500'}`}>{badge.title}</h4>
                                        <p className="text-xs text-slate-400 mt-1">{badge.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </motion.div>
                    )}

                    {/* TRIPS TAB */}
                    {activeTab === 'trips' && (
                        <motion.div
                            key="trips"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="text-center py-20 bg-slate-900/50 rounded-3xl border border-white/5"
                        >
                            <MapIcon size={48} className="mx-auto text-slate-600 mb-4" />
                            <h3 className="text-xl font-bold text-slate-400">Mapa de Viagens em Breve</h3>
                            <p className="text-slate-500">Estamos construindo uma visualização 3D das suas viagens.</p>
                        </motion.div>
                    )}

                    {/* SETTINGS TAB */}
                    {activeTab === 'settings' && (
                        <motion.div
                            key="settings"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                        >
                            <div className="glass-card p-8 rounded-3xl border border-white/5 bg-white/5 backdrop-blur-xl">
                                <h3 className="text-xl font-bold mb-6 border-b border-white/5 pb-4">Editar Informações</h3>
                                {status.message && (
                                    <div className={`mb-6 p-3 rounded-xl text-sm border ${status.type === 'error' ? 'bg-red-500/10 border-red-500/20 text-red-200' : 'bg-green-500/10 border-green-500/20 text-green-200'}`}>
                                        {status.message}
                                    </div>
                                )}
                                <form onSubmit={handleUpdate} className="space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-xs font-medium text-slate-400 ml-1 uppercase">Nome</label>
                                            <input name="name" value={formData.name} onChange={handleChange} className="w-full bg-black/20 border border-white/10 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-cyan-400" />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-xs font-medium text-slate-400 ml-1 uppercase">Email</label>
                                            <input name="email" value={formData.email} onChange={handleChange} className="w-full bg-black/20 border border-white/10 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-cyan-400" />
                                        </div>
                                    </div>
                                    <div className="flex justify-end pt-4">
                                        <button type="submit" disabled={loading} className="bg-cyan-500 hover:bg-cyan-400 text-white font-bold py-3 px-8 rounded-xl shadow-lg transition-all flex items-center gap-2">
                                            {loading ? <Loader2 className="animate-spin" /> : <>Salvar Alterações <Save size={18} /></>}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>
        </div>
    );
};

export default UserProfilePage;
