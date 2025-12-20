import React, { useMemo } from 'react';

export const AuroraBackground = () => {
    // Generate static stars
    const stars = useMemo(() => Array.from({ length: 100 }).map((_, i) => ({
        top: Math.random() * 100 + "%",
        left: Math.random() * 100 + "%",
        size: Math.random() * 2 + 1,
        animationDelay: Math.random() * 5 + "s",
        opacity: Math.random() * 0.7 + 0.3
    })), []);

    return (
        <div className="fixed inset-0 overflow-hidden pointer-events-none -z-50 bg-dark">

            {/* Stars Layer */}
            <div className="absolute inset-0 z-0">
                {stars.map((star, i) => (
                    <div
                        key={i}
                        className="absolute bg-white rounded-full animate-[twinkle_4s_ease-in-out_infinite]"
                        style={{
                            top: star.top,
                            left: star.left,
                            width: star.size + 'px',
                            height: star.size + 'px',
                            opacity: star.opacity,
                            animationDelay: star.animationDelay
                        }}
                    />
                ))}
            </div>

            {/* Aurora Curtains (Cortinas de Luz) */}
            <div className="absolute inset-0 opacity-60 mix-blend-screen">

                {/* Curtain 1: Emerald/Cyan Wave */}
                <div
                    className="absolute -top-[50%] -left-[50%] w-[200%] h-[200%] bg-gradient-to-r from-transparent via-[#34d399] to-transparent blur-[100px] opacity-40 animate-[aurora-wave-1_20s_infinite_linear]"
                    style={{ transformOrigin: 'center' }}
                ></div>

                {/* Curtain 2: Purple/Pink Wave (Offset) */}
                <div
                    className="absolute -top-[50%] -left-[50%] w-[200%] h-[200%] bg-gradient-to-r from-transparent via-[#d946ef] to-transparent blur-[120px] opacity-40 animate-[aurora-wave-2_25s_infinite_linear]"
                    style={{ transformOrigin: 'center', animationDelay: '-5s' }}
                ></div>

                {/* Curtain 3: Deep Blue/Indigo Base */}
                <div
                    className="absolute bottom-0 w-full h-[60%] bg-gradient-to-t from-[#6366f1]/30 to-transparent blur-[80px]"
                ></div>

            </div>

            {/* Map Grid Texture (Scanning) */}
            <div className="absolute inset-0 z-20 opacity-10 mix-blend-overlay">
                <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.1)_1px,transparent_1px)] bg-[size:100px_100px]"></div>
            </div>

            {/* Vignette for Cinematic Look */}
            <div className="absolute inset-0 z-50 bg-radial-gradient from-transparent via-dark/20 to-dark/90 pointer-events-none"></div>

        </div>
    );
};
