import React from 'react';
import { Camera, Image as ImageIcon } from 'lucide-react';
import { motion } from 'framer-motion';

const GalleryPage = () => {
    return (
        <div className="min-h-screen pt-24 px-6 max-w-7xl mx-auto text-white">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center py-20"
            >
                <div className="w-20 h-20 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Camera size={40} className="text-cyan-400" />
                </div>
                <h1 className="text-4xl font-bold mb-4 font-display">Galeria de Fotos</h1>
                <p className="text-xl text-slate-400 max-w-2xl mx-auto mb-12">
                    Compartilhe suas aventuras na Aurora! Em breve você poderá postar fotos dos lugares que visitou.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 opacity-50 pointer-events-none">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="aspect-square bg-slate-800 rounded-xl flex items-center justify-center border border-white/5">
                            <ImageIcon size={32} className="text-slate-600" />
                        </div>
                    ))}
                </div>
                <div className="mt-8">
                    <span className="bg-cyan-500/20 text-cyan-400 px-4 py-2 rounded-full text-sm font-bold uppercase tracking-wider border border-cyan-500/20">Em Breve</span>
                </div>
            </motion.div>
        </div>
    );
};

export default GalleryPage;
