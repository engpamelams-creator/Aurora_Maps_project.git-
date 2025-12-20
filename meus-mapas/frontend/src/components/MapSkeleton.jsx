import React from 'react';

export const MapSkeleton = () => {
    return (
        <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden h-[320px] flex flex-col animate-pulse">
            {/* Map Placeholder */}
            <div className="h-40 bg-slate-700/50 w-full relative">
                <div className="absolute top-4 right-4 w-8 h-8 rounded-full bg-slate-600/50" />
            </div>

            {/* Content Placeholder */}
            <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                    <div className="h-6 w-3/4 bg-slate-700/50 rounded-md mb-3" />
                    <div className="h-4 w-1/2 bg-slate-700/30 rounded-md" />
                </div>

                <div className="flex items-center gap-2 mt-4">
                    <div className="h-8 w-20 bg-slate-700/30 rounded-lg" />
                    <div className="h-8 w-8 bg-slate-700/30 rounded-full ml-auto" />
                </div>
            </div>
        </div>
    );
};
