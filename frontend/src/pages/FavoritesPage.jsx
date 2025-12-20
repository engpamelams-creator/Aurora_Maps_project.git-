import React from 'react';
import { Heart, Star } from 'lucide-react';
import { motion } from 'framer-motion';

const FavoritesPage = () => {
    return (
        <div className="min-h-screen pt-24 px-6 max-w-7xl mx-auto text-white">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center py-20"
            >
                <div className="w-20 h-20 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Heart size={40} className="text-pink-500" />
                </div>
                <h1 className="text-4xl font-bold mb-4 font-display">Meus Favoritos</h1>
                <p className="text-xl text-slate-400 max-w-2xl mx-auto mb-12">
                    Guarde os mapas que você mais ama para acesso rápido.
                </p>

                <div className="py-12 border-2 border-dashed border-white/10 rounded-3xl bg-white/5 flex flex-col items-center justify-center">
                    <Star className="text-slate-600 mb-4" size={48} />
                    <p className="text-slate-500 font-medium">Você ainda não tem favoritos.</p>
                </div>
            </motion.div>
        </div>
    );
};

export default FavoritesPage;
