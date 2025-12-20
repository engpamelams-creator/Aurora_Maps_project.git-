import React from 'react';
import { Link } from 'react-router-dom';
import { Edit2, Share2, Trash2, MapPin } from 'lucide-react';
import { ShareButtons } from './ShareButtons';
import { motion } from 'framer-motion';

const MapCard = ({ map }) => {
    return (
        <motion.div
            whileHover={{ y: -5 }}
            className="group glass-card rounded-2xl overflow-hidden hover:shadow-[0_8px_32px_rgba(124,58,237,0.2)] hover:border-primary/30"
        >
            {/* Map Preview Area with Orbs */}
            <Link to={`/map/${map.id}`} className="block relative h-40 bg-gradient-to-br from-primary/10 to-secondary/10 overflow-hidden">
                <div className="absolute inset-0 opacity-30 group-hover:opacity-50 transition-opacity duration-500">
                    <div className="absolute top-[-20%] right-[-10%] w-24 h-24 bg-primary rounded-full blur-[40px] animate-pulse" />
                    <div className="absolute bottom-[-10%] left-[-10%] w-20 h-20 bg-secondary rounded-full blur-[30px] animate-pulse" style={{ animationDelay: '1s' }} />
                </div>

                {/* Center Icon */}
                <div className="absolute inset-0 flex items-center justify-center">
                    <MapPin className="text-primary/60 w-10 h-10 group-hover:scale-110 group-hover:text-primary transition-all duration-300 drop-shadow-[0_0_15px_rgba(124,58,237,0.5)]" />
                </div>

                {/* Points Badge */}
                <div className="absolute top-3 right-3 px-3 py-1 bg-black/40 backdrop-blur-md rounded-full text-xs font-semibold text-white border border-white/10">
                    {map.points_count || 0} pontos
                </div>

                {/* Category/Curated Badge */}
                {map.is_curated && (
                    <div className="absolute top-3 left-3 px-3 py-1 bg-primary/80 backdrop-blur-md rounded-full text-xs font-bold text-white uppercase tracking-wider shadow-lg">
                        Oficial
                    </div>
                )}
            </Link>

            {/* Content Section */}
            <div className="p-5">
                <div className="flex justify-between items-start mb-4">
                    <Link to={`/map/${map.id}`} className="block flex-1 min-w-0">
                        <h3 className="text-lg font-bold text-white truncate group-hover:text-primary-light transition-colors font-display">{map.name}</h3>
                        <p className="text-xs text-text-muted mt-1 font-medium">{map.category || 'Exploração'}</p>
                    </Link>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-between pt-4 border-t border-white/5">
                    <div className="flex gap-2">
                        <ShareButtons />
                        {/* Only show delete if user map (not curated) logic would go here if we had auth context, assuming simple layout for now */}
                        {!map.is_curated && (
                            <button className="p-2 text-text-muted hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors">
                                <Trash2 size={16} />
                            </button>
                        )}
                    </div>

                    <span className={`text-xs px-2 py-1 rounded-full border ${map.is_public ? 'bg-secondary/10 text-secondary border-secondary/20' : 'bg-white/5 text-text-muted border-white/10'}`}>
                        {map.is_public ? 'Público' : 'Privado'}
                    </span>
                </div>
            </div>
        </motion.div>
    );
};

export default MapCard;
