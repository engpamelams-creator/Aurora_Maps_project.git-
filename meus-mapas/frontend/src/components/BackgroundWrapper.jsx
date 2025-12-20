import React from 'react';
import { AuroraBackground } from './AuroraBackground';

export const BackgroundWrapper = ({ children }) => {
    return (
        <div className="min-h-screen relative overflow-hidden text-slate-900 dark:text-slate-50 selection:bg-cyan-500/30 selection:text-cyan-900 dark:selection:text-white transition-colors duration-500">
            {/* Unified Global Background */}
            <AuroraBackground />

            {/* Content with higher z-index */}
            <div className="relative z-10">
                {children}
            </div>
        </div>
    );
};
