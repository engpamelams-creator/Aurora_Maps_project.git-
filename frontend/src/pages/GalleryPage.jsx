import React, { useState } from 'react';
import { Camera, X, MapPin, Heart, Share2, Download } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const mockPhotos = [
    {
        id: 1,
        url: 'https://images.unsplash.com/photo-1531366936337-7c912a4589a7?auto=format&fit=crop&q=80',
        title: 'Aurora Boreal na Islândia',
        location: 'Reykjavik, Islândia',
        user: 'Sarah Connor',
        likes: 1240
    },
    {
        id: 2,
        url: 'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?auto=format&fit=crop&q=80',
        title: 'Luzes de Chicago',
        location: 'Chicago, USA',
        user: 'Mike Ross',
        likes: 890
    },
    {
        id: 3,
        url: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80',
        title: 'Nascer do Sol nos Alpes',
        location: 'Suíça',
        user: 'Elena Fisher',
        likes: 2100
    },
    {
        id: 4,
        url: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&q=80',
        title: 'Céu Estrelado',
        location: 'Deserto do Atacama, Chile',
        user: 'John Doe',
        likes: 3400
    },
    {
        id: 5,
        url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80',
        title: 'Praia Paradisíaca',
        location: 'Maldivas',
        user: 'Jane Smith',
        likes: 1500
    },
    {
        id: 6,
        url: 'https://images.unsplash.com/photo-1473580044384-7ba9967e16a0?auto=format&fit=crop&q=80',
        title: 'Dunas infinitas',
        location: 'Namíbia',
        user: 'Arthur Dent',
        likes: 720
    },
    {
        id: 7,
        url: 'https://images.unsplash.com/photo-1493246507139-91e8fad9978e?auto=format&fit=crop&q=80',
        title: 'Lago Alpino',
        location: 'Banff, Canadá',
        user: 'Lara Croft',
        likes: 1800
    },
    {
        id: 8,
        url: 'https://images.unsplash.com/photo-1513689125086-6c43317ace28?auto=format&fit=crop&q=80',
        title: 'Outono em Kyotto',
        location: 'Kyoto, Japão',
        user: 'Hideo A.',
        likes: 950
    },
    {
        id: 9,
        url: 'https://images.unsplash.com/photo-1590523278135-c598eb2d8f93?auto=format&fit=crop&q=80',
        title: 'Café Parisiense',
        location: 'Paris, França',
        user: 'Amélie P.',
        likes: 1120
    }
];

const GalleryPage = () => {
    const [selectedId, setSelectedId] = useState(null);

    return (
        <div className="min-h-screen pt-24 pb-12 px-6 max-w-[1600px] mx-auto text-white">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center mb-16"
            >
                <div className="inline-flex items-center justify-center p-3 rounded-full bg-cyan-500/10 mb-4 ring-1 ring-cyan-500/30">
                    <Camera size={24} className="text-cyan-400" />
                </div>
                <h1 className="text-5xl font-bold mb-4 font-display bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
                    Galeria da Comunidade
                </h1>
                <p className="text-lg text-slate-400 max-w-2xl mx-auto">
                    Explore o mundo através das lentes dos nossos exploradores.
                    Descubra lugares incríveis e inspire-se para sua próxima jornada.
                </p>
            </motion.div>

            <motion.div
                layout
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            >
                {mockPhotos.map((photo) => (
                    <motion.div
                        layoutId={`card-${photo.id}`}
                        key={photo.id}
                        onClick={() => setSelectedId(photo.id)}
                        whileHover={{ y: -5, transition: { duration: 0.2 } }}
                        className="group relative aspect-[4/5] rounded-2xl overflow-hidden cursor-pointer bg-slate-900 border border-white/5 shadow-2xl"
                    >
                        <motion.img
                            src={photo.url}
                            alt={photo.title}
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
                            <h3 className="text-lg font-bold text-white mb-1">{photo.title}</h3>
                            <div className="flex items-center gap-2 text-xs text-cyan-300 mb-3">
                                <MapPin size={12} />
                                <span>{photo.location}</span>
                            </div>
                            <div className="flex items-center justify-between text-xs text-slate-300">
                                <span className="font-medium">@{photo.user}</span>
                                <div className="flex items-center gap-1">
                                    <Heart size={12} className="fill-current" /> {photo.likes}
                                </div>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </motion.div>

            <AnimatePresence>
                {selectedId && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-black/90 backdrop-blur-xl"
                            onClick={() => setSelectedId(null)}
                        />

                        {(() => {
                            const photo = mockPhotos.find(p => p.id === selectedId);
                            if (!photo) return null;

                            return (
                                <motion.div
                                    layoutId={`card-${selectedId}`}
                                    className="relative w-full max-w-5xl max-h-[90vh] bg-slate-900 rounded-3xl overflow-hidden shadow-2xl flex flex-col md:flex-row"
                                    onClick={(e) => e.stopPropagation()}
                                >
                                    {/* Image Section */}
                                    <div className="flex-1 bg-black relative flex items-center justify-center overflow-hidden">
                                        <motion.img
                                            src={photo.url}
                                            alt={photo.title}
                                            className="w-full h-full object-contain max-h-[60vh] md:max-h-[90vh]"
                                        />
                                        <button
                                            onClick={() => setSelectedId(null)}
                                            className="absolute top-4 left-4 p-2 bg-black/50 hover:bg-black/70 rounded-full text-white backdrop-blur-sm transition-colors md:hidden"
                                        >
                                            <X size={20} />
                                        </button>
                                    </div>

                                    {/* Info Section Sidebar */}
                                    <div className="w-full md:w-96 bg-slate-900 border-l border-white/5 p-8 flex flex-col">
                                        <div className="flex justify-between items-start mb-6">
                                            <div>
                                                <h2 className="text-2xl font-bold text-white mb-2">{photo.title}</h2>
                                                <div className="flex items-center gap-2 text-cyan-400 text-sm">
                                                    <MapPin size={16} />
                                                    {photo.location}
                                                </div>
                                            </div>
                                            <button
                                                onClick={() => setSelectedId(null)}
                                                className="p-2 hover:bg-white/10 rounded-full text-slate-400 hover:text-white transition-colors hidden md:block"
                                            >
                                                <X size={24} />
                                            </button>
                                        </div>

                                        <div className="flex items-center gap-4 py-6 border-t border-b border-white/5 mb-6">
                                            <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-purple-500 to-cyan-500 p-[2px]">
                                                <div className="w-full h-full rounded-full bg-slate-900 flex items-center justify-center font-bold text-lg">
                                                    {photo.user.charAt(0)}
                                                </div>
                                            </div>
                                            <div>
                                                <p className="font-bold text-white">{photo.user}</p>
                                                <p className="text-xs text-slate-500">Explorador Nível 8</p>
                                            </div>
                                            <button className="ml-auto px-4 py-1.5 rounded-full bg-white/5 hover:bg-white/10 text-xs font-semibold text-white transition-colors">
                                                Seguir
                                            </button>
                                        </div>

                                        <div className="grid grid-cols-2 gap-4 mb-auto">
                                            <div className="p-4 rounded-xl bg-black/20 text-center">
                                                <span className="block text-2xl font-bold text-white">{photo.likes}</span>
                                                <span className="text-xs text-slate-500 uppercase tracking-wider">Likes</span>
                                            </div>
                                            <div className="p-4 rounded-xl bg-black/20 text-center">
                                                <span className="block text-2xl font-bold text-white">4.8k</span>
                                                <span className="text-xs text-slate-500 uppercase tracking-wider">Views</span>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 gap-3 mt-6">
                                            <button className="flex items-center justify-center gap-2 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-white font-medium transition-colors">
                                                <Heart size={18} /> <span className="text-sm">Curtir</span>
                                            </button>
                                            <button className="flex items-center justify-center gap-2 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-white font-medium transition-colors">
                                                <Share2 size={18} /> <span className="text-sm">Share</span>
                                            </button>
                                            <button className="col-span-2 flex items-center justify-center gap-2 py-3 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 font-medium transition-colors">
                                                <Download size={18} /> <span className="text-sm">Download Wallpaper</span>
                                            </button>
                                        </div>
                                    </div>
                                </motion.div>
                            );
                        })()}
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default GalleryPage;
