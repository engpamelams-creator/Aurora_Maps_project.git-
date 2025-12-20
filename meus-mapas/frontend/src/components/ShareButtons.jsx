import React from 'react';
import { Camera, MessageCircle, Facebook, Copy, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export function ShareButtons({ url }) {
    const [copied, setCopied] = React.useState(false);
    const shareUrl = url || window.location.href;

    const shareMap = (platform) => {
        const links = {
            whatsapp: `https://wa.me/?text=${encodeURIComponent(shareUrl)}`,
            facebook: `https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`,
        };

        if (platform === "instagram" || platform === "copy") {
            navigator.clipboard.writeText(shareUrl);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
            return;
        }

        window.open(links[platform], "_blank");
    };

    const btnClass = "w-8 h-8 flex items-center justify-center rounded-full bg-white/5 hover:bg-white/20 text-text-muted hover:text-white transition-all border border-white/5 hover:border-white/20";

    return (
        <div className="flex items-center gap-2">
            <button onClick={() => shareMap('copy')} className={btnClass} title="Instagram (Copiar Link)">
                <Camera size={14} />
            </button>
            <button onClick={() => shareMap('whatsapp')} className={btnClass} title="WhatsApp">
                <MessageCircle size={14} />
            </button>
            <button onClick={() => shareMap('facebook')} className={btnClass} title="Facebook">
                <Facebook size={14} />
            </button>

            <div className="relative">
                <button className={btnClass} onClick={() => shareMap('copy')} title="Copiar Link">
                    {copied ? <Check size={14} className="text-green-400" /> : <Copy size={14} />}
                </button>
                <AnimatePresence>
                    {copied && (
                        <motion.span
                            initial={{ opacity: 0, y: 10, x: '-50%' }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="absolute -top-8 left-1/2 text-[10px] text-green-400 whitespace-nowrap bg-dark-lighter px-2 py-1 rounded border border-green-500/20 z-50 shadow-lg"
                        >
                            Link copiado!
                        </motion.span>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
