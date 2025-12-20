import React from 'react';
import { Loader2 } from 'lucide-react';

export const Loading = () => {
    return (
        <div className="flex h-screen items-center justify-center bg-slate-900/50 backdrop-blur-sm relative z-50">
            <div className="flex flex-col items-center gap-4">
                <div className="relative">
                    <div className="absolute inset-0 bg-cyan-500 blur-lg opacity-50 rounded-full animate-pulse"></div>
                    <Loader2 className="relative z-10 text-cyan-400 animate-spin" size={48} />
                </div>
                <p className="text-slate-400 text-sm font-medium animate-pulse tracking-wider">CARREGANDO UNIVERSO...</p>
            </div>
        </div>
    );
};
