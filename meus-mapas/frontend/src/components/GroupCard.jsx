import React from 'react';
import { Users, MapPin } from 'lucide-react';

export const GroupCard = ({ group }) => (
    <div className="bg-slate-900/60 backdrop-blur-md border border-white/10 rounded-2xl p-5 hover:border-cyan-500/30 transition-all group relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-50 group-hover:opacity-100 transition-opacity">
            <Users className="text-cyan-400" size={24} />
        </div>

        <div className="flex items-start gap-4">
            <img
                src={group.image}
                alt={group.name}
                className="w-16 h-16 rounded-xl object-cover border border-white/10"
            />
            <div>
                <h3 className="text-lg font-bold text-white mb-1 group-hover:text-cyan-400 transition-colors">{group.name}</h3>
                <div className="flex items-center gap-2 text-xs text-slate-400 mb-3">
                    <MapPin size={12} className="text-purple-400" />
                    <span>{group.location}</span>
                    <span className="w-1 h-1 bg-slate-600 rounded-full" />
                    <span>{group.members} membros</span>
                </div>
                <button className="bg-white/5 hover:bg-cyan-500 hover:text-white text-cyan-400 text-sm font-bold py-1.5 px-4 rounded-lg transition-all border border-cyan-500/20 hover:border-cyan-500">
                    Entrar no Grupo
                </button>
            </div>
        </div>
    </div>
);
