import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, MessageCircle, Share2, Bookmark, MapPin, MoreHorizontal, Plane } from 'lucide-react';
import { socialService } from '../services/socialService';

// Updated "PostCard" with "Fly to Here" functionality and Sci-Fi aesthetic
const PostCard = ({ post }) => {
    const [liked, setLiked] = useState(post.liked_by_me);
    const [likesCount, setLikesCount] = useState(post.stats?.likes || 0);
    const [isHeartAnimating, setIsHeartAnimating] = useState(false);

    const handleLike = async () => {
        const newLiked = !liked;
        setLiked(newLiked);
        setLikesCount(prev => newLiked ? prev + 1 : prev - 1);
        setIsHeartAnimating(true);
        setTimeout(() => setIsHeartAnimating(false), 1000);

        try {
            await socialService.toggleLike(post.id);
        } catch (err) {
            // Revert on error
            setLiked(!newLiked);
            setLikesCount(prev => newLiked ? prev - 1 : prev + 1);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            className="mb-8 bg-slate-900/40 backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden shadow-2xl hover:shadow-cyan-500/10 transition-all duration-500 group"
        >
            {/* Header - Glassy & Premium */}
            <div className="p-4 flex items-center justify-between relative z-10 bg-gradient-to-b from-black/20 to-transparent">
                <div className="flex items-center gap-3">
                    <div className="relative">
                        <img
                            src={post.author.avatar}
                            alt={post.author.name}
                            className="w-12 h-12 rounded-full border-2 border-cyan-500/50 p-0.5 object-cover"
                        />
                        <div className="absolute -bottom-1 -right-1 bg-slate-900 rounded-full p-1 border border-white/10">
                            <MapPin size={10} className="text-cyan-400" />
                        </div>
                    </div>
                    <div>
                        <h3 className="font-bold text-white text-base leading-tight">
                            {post.author.name}
                        </h3>
                        {post.location.name && (
                            <div className="flex items-center gap-1.5 mt-0.5 group/loc cursor-pointer">
                                <span className="text-cyan-400 text-xs font-semibold tracking-wide bg-cyan-950/30 px-2 py-0.5 rounded-full border border-cyan-500/20 group-hover/loc:bg-cyan-500/20 transition-colors">
                                    {post.location.name}
                                </span>
                                <span className="text-slate-500 text-xs">• {post.created_at}</span>
                            </div>
                        )}
                    </div>
                </div>
                <button className="text-slate-500 hover:text-white transition-colors bg-white/5 p-2 rounded-full hover:bg-white/10">
                    <MoreHorizontal size={20} />
                </button>
            </div>

            {/* Media Content - Immersive */}
            <div className="relative w-full bg-slate-950 group/media">
                {post.media_url ? (
                    <div className="relative overflow-hidden">
                        <img
                            src={post.media_url}
                            alt="Content"
                            className="w-full h-auto max-h-[600px] object-cover"
                        />

                        {/* Gradient Overlay for Text Readability if needed */}
                        <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-slate-900/60 to-transparent opacity-0 group-hover/media:opacity-100 transition-opacity duration-300" />

                        {/* Heart Explosion */}
                        <AnimatePresence>
                            {isHeartAnimating && liked && (
                                <motion.div
                                    initial={{ scale: 0, opacity: 0 }}
                                    animate={{ scale: 1.5, opacity: 1 }}
                                    exit={{ scale: 3, opacity: 0 }}
                                    className="absolute inset-0 flex items-center justify-center pointer-events-none"
                                >
                                    <Heart size={120} className="text-white fill-white drop-shadow-[0_0_25px_rgba(255,255,255,0.6)]" />
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                ) : (
                    // Sci-Fi Map Placeholder
                    <div className="aspect-[2/1] bg-slate-800 relative overflow-hidden group/map cursor-pointer">
                        <div className="absolute inset-0 bg-[url('https://cartodb-basemaps-a.global.ssl.fastly.net/dark_all/12/1234/1234.png')] bg-cover opacity-60 grayscale group-hover/map:grayscale-0 transition-all duration-700" />
                        <div className="absolute inset-0 bg-cyan-900/20 mix-blend-overlay" />
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-20 h-20 bg-cyan-500/20 rounded-full flex items-center justify-center animate-pulse border border-cyan-500/50 shadow-[0_0_30px_rgba(34,211,238,0.3)]">
                                <MapPin className="text-cyan-400 drop-shadow-lg" size={40} />
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Premium Footer */}
            <div className="p-5">
                {/* Action Bar */}
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-6">
                        <motion.button
                            whileTap={{ scale: 0.8 }}
                            onClick={handleLike}
                            className="flex items-center gap-2 group/btn"
                        >
                            <Heart size={28} className={`transition-all duration-300 ${liked ? 'text-rose-500 fill-rose-500 drop-shadow-[0_0_10px_rgba(244,63,94,0.6)]' : 'text-slate-300 group-hover/btn:text-white'}`} />
                        </motion.button>

                        <motion.button whileTap={{ scale: 0.9 }} className="group/btn">
                            <MessageCircle size={26} className="text-slate-300 group-hover/btn:text-cyan-400 transition-colors" />
                        </motion.button>

                        <motion.button whileTap={{ scale: 0.9 }} className="group/btn">
                            <Share2 size={26} className="text-slate-300 group-hover/btn:text-green-400 transition-colors" />
                        </motion.button>
                    </div>

                    {/* The "Evolution" Feature: Fly To Location 3D Button */}
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="flex items-center gap-2 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white px-5 py-2.5 rounded-full shadow-lg shadow-cyan-500/20 font-bold text-sm tracking-wide group/fly relative overflow-hidden"
                    >
                        <div className="absolute inset-0 bg-white/20 translate-y-full group-hover/fly:translate-y-0 transition-transform duration-300" />
                        <Plane size={18} className="group-hover/fly:-rotate-45 transition-transform duration-300" />
                        <span>Voar para lá</span>
                    </motion.button>
                </div>

                {/* Social Proof (Facepile) */}
                <div className="flex items-center gap-3 mb-3">
                    {likesCount > 0 && (
                        <div className="flex -space-x-2">
                            {[1, 2, 3].map(i => (
                                <div key={i} className="w-5 h-5 rounded-full border border-slate-900 bg-slate-700" />
                            ))}
                        </div>
                    )}
                    <div className="text-sm font-medium text-slate-300">
                        Curtido por <span className="text-white font-bold">{likesCount} exploradores</span>
                    </div>
                </div>

                {/* Caption */}
                <div className="text-sm leading-relaxed text-slate-300">
                    <span className="font-bold text-white mr-2 text-base">{post.author.name}</span>
                    {post.content}
                </div>
            </div>
        </motion.div>
    );
};

export default PostCard;
