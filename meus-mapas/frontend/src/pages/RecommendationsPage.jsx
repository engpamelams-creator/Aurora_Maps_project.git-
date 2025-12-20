import React from 'react';
import { Sparkles, Map } from 'lucide-react';
import { motion } from 'framer-motion';

const RecommendationsPage = () => {
    return (
        <div className="min-h-screen pt-24 px-6 max-w-7xl mx-auto text-white">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center py-20"
            >
                <div className="w-20 h-20 bg-gradient-to-tr from-purple-500 to-amber-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-[0_0_30px_rgba(168,85,247,0.4)]">
                    <Sparkles size={40} className="text-white" />
                </div>
                <h1 className="text-4xl font-bold mb-4 font-display">Recomendações para Você</h1>
                <p className="text-xl text-slate-400 max-w-2xl mx-auto mb-12">
                    Mapas e destinos selecionados com base no seu perfil de viajante.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                    {[1, 2].map((i) => (
                        <div key={i} className="bg-slate-900/50 border border-white/10 rounded-2xl p-6 text-left hover:border-purple-500/50 transition-colors">
                            <div className="flex items-start gap-4">
                                <div className="bg-purple-500/10 p-3 rounded-lg">
                                    <Map className="text-purple-400" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-lg mb-1">Tesouros Escondidos</h3>
                                    <p className="text-slate-400 text-sm">Uma coleção de lugares pouco explorados que combinam com seu estilo de aventura.</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </motion.div>
        </div>
    );
};

export default RecommendationsPage;
