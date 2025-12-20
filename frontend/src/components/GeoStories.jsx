import React from 'react';
import { Plus } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';

const StoryCircle = ({ image, name, isUser }) => (
    <motion.div
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="flex flex-col items-center gap-2 cursor-pointer group min-w-[72px]"
    >
        <div className={`relative w-[72px] h-[72px] rounded-full p-[3px] ${isUser ? 'bg-slate-700' : 'bg-gradient-to-tr from-cyan-400 via-purple-500 to-pink-500 animate-spin-slow-static hover:animate-spin-slow'}`}>
            <div className="w-full h-full rounded-full border-4 border-slate-900 overflow-hidden relative bg-slate-800">
                <img src={image} alt={name} className="w-full h-full object-cover transition-transform duration-500" />

                {/* User Add Badge - Bottom Right */}
                {isUser && (
                    <div className="absolute inset-0 bg-black/20" /> // Subtle dim
                )}
            </div>

            {/* Floating Plus Badge for User */}
            {isUser && (
                <div className="absolute bottom-0 right-0 w-6 h-6 bg-cyan-500 rounded-full border-2 border-slate-900 flex items-center justify-center shadow-lg">
                    <Plus size={14} className="text-white stroke-[3]" />
                </div>
            )}
        </div>
        <span className="text-xs font-medium text-slate-300 truncate w-full text-center group-hover:text-white transition-colors">
            {isUser ? 'Seu Story' : name}
        </span>
    </motion.div>
);

export const GeoStories = () => {
    const { user } = useAuth();
    const userName = user?.name || 'Você';
    const userAvatar = user?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(userName)}&background=0D9488&color=fff`;

    return (
        <div className="bg-slate-900/60 backdrop-blur-md border border-white/10 rounded-2xl p-5 mb-6 overflow-x-auto custom-scrollbar">
            <div className="flex gap-4">
                <StoryCircle isUser image={userAvatar} name={userName} />
                {[1, 2, 3, 4, 5, 6, 7].map((i) => (
                    <StoryCircle
                        key={i}
                        name={`Explorer ${i}`}
                        image={`https://picsum.photos/seed/${i + 555}/200`}
                    />
                ))}
            </div>
        </div>
    );
};
