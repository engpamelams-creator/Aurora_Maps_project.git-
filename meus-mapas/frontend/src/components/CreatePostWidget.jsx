import React, { useState } from 'react';
import { Image, Video, MapPin, Send } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';

export const CreatePostWidget = () => {
    const { user } = useAuth();
    const [isFocused, setIsFocused] = useState(false);
    const [location, setLocation] = useState(null);

    const userName = user?.name || 'Explorador';
    const userAvatar = user?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(userName)}&background=0D9488&color=fff`; // Fallback

    return (
        <motion.div
            layout
            className="bg-slate-900/60 backdrop-blur-md border border-white/10 rounded-2xl p-4 mb-6 shadow-xl relative overflow-hidden"
        >
            {/* Glow Effect */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 opacity-50" />

            <div className="flex gap-4">
                <img
                    src={userAvatar}
                    alt={userName}
                    className="w-10 h-10 rounded-full border-2 border-slate-700"
                />
                <div className="flex-1">
                    <input
                        type="text"
                        onFocus={() => setIsFocused(true)}
                        onBlur={() => !location && setIsFocused(false)}
                        placeholder={`Onde você está explorando hoje, ${userName}?`}
                        className="w-full bg-slate-800/50 border border-slate-700/50 rounded-xl px-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:border-cyan-500/50 focus:bg-slate-800 transition-all font-medium"
                    />

                    <AnimatePresence>
                        {isFocused && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                className="mt-4 flex items-center justify-between border-t border-white/5 pt-3"
                            >
                                <div className="flex gap-2">
                                    <button className="flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-white/5 text-slate-400 hover:text-green-400 transition-colors text-sm font-medium">
                                        <Image size={18} />
                                        Foto
                                    </button>
                                    <button className="flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-white/5 text-slate-400 hover:text-red-400 transition-colors text-sm font-medium">
                                        <Video size={18} />
                                        Vídeo
                                    </button>
                                    <button
                                        onClick={() => setLocation("Rio de Janeiro")}
                                        className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition-colors text-sm font-medium ${location ? 'bg-cyan-500/20 text-cyan-400' : 'hover:bg-white/5 text-slate-400 hover:text-cyan-400'}`}
                                    >
                                        <MapPin size={18} />
                                        {location ? location : 'Marcar Local'}
                                    </button>
                                </div>
                                <button className="bg-gradient-to-r from-cyan-500 to-blue-600 p-2 rounded-lg text-white shadow-lg shadow-cyan-500/20 hover:scale-105 transition-transform">
                                    <Send size={18} />
                                </button>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </motion.div>
    );
};
