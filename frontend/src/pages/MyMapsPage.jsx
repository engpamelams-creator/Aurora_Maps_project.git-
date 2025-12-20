import React from 'react';
import { Map as MapIcon, Plus } from 'lucide-react';
import { motion } from 'framer-motion';

const MyMapsPage = () => {
    return (
        <div className="min-h-screen pt-24 px-6 max-w-7xl mx-auto text-white">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center py-20"
            >
                <div className="w-20 h-20 bg-cyan-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                    <MapIcon size={40} className="text-cyan-400" />
                </div>
                <h1 className="text-4xl font-bold mb-4 font-display">Meus Mapas</h1>
                <p className="text-xl text-slate-400 max-w-2xl mx-auto mb-12">
                    Gerencie suas criações e rotas de viagem.
                </p>

                <div className="py-12 border-2 border-dashed border-white/10 rounded-3xl bg-white/5 flex flex-col items-center justify-center group hover:border-cyan-500/50 transition-colors cursor-pointer">
                    <Plus className="text-slate-600 mb-4 group-hover:text-cyan-400 transition-colors" size={48} />
                    <p className="text-slate-500 font-medium group-hover:text-cyan-400 transition-colors">Criar Novo Mapa</p>
                </div>
            </motion.div>
        </div>
    );
};

export default MyMapsPage;
