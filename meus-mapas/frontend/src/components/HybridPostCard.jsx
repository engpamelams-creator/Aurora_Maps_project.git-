import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, MessageCircle, Share2, Bookmark, MapPin, MoreHorizontal } from 'lucide-react';
import { socialService } from '../services/socialService';

// The "Hybrid Card" combines Facebook's context with Instagram's immersion
const HybridPostCard = ({ post }) => {
    const [liked, setLiked] = useState(post.liked_by_me);
    const [likesCount, setLikesCount] = useState(post.stats.likes);
    const [isHeartAnimating, setIsHeartAnimating] = useState(false);

    const handleLike = async () => {
        // optimistically toggle
        const newLiked = !liked;
        setLiked(newLiked);
        setLikesCount(prev => newLiked ? prev + 1 : prev - 1);
        setIsHeartAnimating(true);

        try {
            await socialService.toggleLike(post.id);
        } catch (err) {
            // rollback
            setLiked(!newLiked);
            setLikesCount(prev => newLiked ? prev - 1 : prev + 1);
        }

        setTimeout(() => setIsHeartAnimating(false), 1000);
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            className="mb-8 bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl relative group"
        >
            {/* 1. Header: Context is King */}
            <div className="p-4 flex items-center justify-between bg-slate-900/90 backdrop-blur-sm sticky top-0 z-10">
                <div className="flex items-center gap-3">
                    <div className="relative">
                        <img
                            src={post.author.avatar}
                            alt={post.author.name}
                            className="w-10 h-10 rounded-full border-2 border-slate-800 object-cover"
                        />
                        {/* Explorador Badge simulation */}
                        <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-cyan-500 rounded-full border-2 border-slate-900 flex items-center justify-center">
                            <span className="text-[8px] font-bold text-slate-900">★</span>
                        </div>
                    </div>
                    <div>
                        <h3 className="font-bold text-white text-sm leading-tight hover:underline cursor-pointer">
                            {post.author.name}
                        </h3>
                        {post.location.name && (
                            <div className="flex items-center gap-1 text-xs text-cyan-400 font-medium cursor-pointer hover:text-cyan-300 transition-colors">
                                <MapPin size={12} fill="currentColor" />
                                <span>{post.location.name}</span>
                            </div>
                        )}
                    </div>
                </div>
                <button className="text-slate-500 hover:text-white transition-colors">
                    <MoreHorizontal size={20} />
                </button>
            </div>

            {/* 2. Body: Immersive Media (Full Bleed) */}
            <div className="relative aspect-[4/5] bg-slate-950 flex items-center justify-center overflow-hidden">
                <img
                    src={post.media_url}
                    alt="Post content"
                    className="w-full h-full object-cover"
                    loading="lazy"
                />

                {/* Heart Explosion Animation */}
                <AnimatePresence>
                    {isHeartAnimating && liked && (
                        <motion.div
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 1.5, opacity: 1 }}
                            exit={{ scale: 3, opacity: 0 }}
                            transition={{ duration: 0.5 }}
                            className="absolute inset-0 flex items-center justify-center pointer-events-none"
                        >
                            <Heart size={120} className="text-white fill-white drop-shadow-2xl" />
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* 3. Footer: Interaction & Social Proof */}
            <div className="p-4 bg-gradient-to-b from-slate-900/50 to-slate-900">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-6">
                        <button
                            onClick={handleLike}
                            className="group flex flex-col items-center gap-1"
                        >
                            <motion.div whileTap={{ scale: 0.8 }}>
                                <Heart
                                    size={28}
                                    className={`transition-colors duration-300 ${liked ? 'text-red-500 fill-red-500' : 'text-white hover:text-slate-200'}`}
                                />
                            </motion.div>
                        </button>

                        <button className="group flex flex-col items-center gap-1">
                            <motion.div whileTap={{ scale: 0.9 }}>
                                <MessageCircle size={28} className="text-white hover:text-cyan-400 transition-colors" />
                            </motion.div>
                        </button>

                        <button className="group flex flex-col items-center gap-1">
                            <motion.div whileTap={{ scale: 0.9 }}>
                                <Share2 size={28} className="text-white hover:text-green-400 transition-colors" />
                            </motion.div>
                        </button>
                    </div>

                    <button>
                        <Bookmark size={28} className="text-white hover:text-amber-400 transition-colors" />
                    </button>
                </div>

                {/* Social Proof Text */}
                <div className="space-y-2">
                    <div className="font-bold text-white text-sm">
                        {likesCount} {likesCount === 1 ? 'curtida' : 'curtidas'}
                    </div>

                    <div className="text-sm">
                        <span className="font-bold text-white mr-2">{post.author.name}</span>
                        <span className="text-slate-300">{post.content}</span>
                    </div>

                    {post.stats.comments > 0 && (
                        <button className="text-slate-500 text-sm font-medium hover:text-slate-300 transition-colors">
                            Ver todos os {post.stats.comments} comentários
                        </button>
                    )}

                    <div className="text-[10px] text-slate-500 uppercase tracking-widest font-medium">
                        {post.created_at}
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default HybridPostCard;
