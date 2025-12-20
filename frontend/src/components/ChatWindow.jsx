import React, { useState, useEffect, useRef } from 'react';
import { X, Minus, Image, Smile, Send, UserPlus, Zap, Paperclip } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const ChatWindow = ({ recipient, onClose }) => {
    const [messages, setMessages] = useState([
        { id: 1, text: `Oi! Vi que você está explorando ${recipient.name.split(' ')[0]} também!`, sender: 'them', time: '10:00' },
    ]);
    const [inputText, setInputText] = useState('');
    const [isShaking, setIsShaking] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(scrollToBottom, [messages]);

    const handleSend = () => {
        if (!inputText.trim()) return;

        const newMsg = {
            id: Date.now(),
            text: inputText,
            sender: 'me',
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };

        setMessages([...messages, newMsg]);
        setInputText('');

        // Simulate reply
        setTimeout(() => {
            setMessages(prev => [...prev, {
                id: Date.now() + 1,
                text: 'Que legal! Vamos marcar de nos encontrar?',
                sender: 'them',
                time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            }]);
        }, 3000);
    };

    const handleNudge = () => {
        setIsShaking(true);
        // Play sound effect here ideally
        const nudgeMsg = { id: Date.now(), type: 'nudge', sender: 'me' };
        setMessages([...messages, nudgeMsg]);
        setTimeout(() => setIsShaking(false), 500);
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 100, scale: 0.9 }}
            animate={{
                opacity: 1,
                y: 0,
                scale: 1,
                x: isShaking ? [0, -10, 10, -10, 10, 0] : 0
            }}
            exit={{ opacity: 0, y: 100, scale: 0.9 }}
            transition={{ type: "spring", duration: 0.5 }}
            className="fixed bottom-0 right-4 md:right-20 w-[320px] md:w-[380px] bg-slate-900/95 backdrop-blur-xl border border-white/20 rounded-t-2xl shadow-2xl z-50 overflow-hidden flex flex-col h-[500px]"
        >
            {/* MSN Header */}
            <div className="bg-gradient-to-r from-cyan-600 to-blue-600 p-3 flex items-center justify-between cursor-pointer" onClick={() => { }}>
                <div className="flex items-center gap-2">
                    <div className="relative">
                        <img src={recipient.avatar} alt="" className="w-8 h-8 rounded-full border-2 border-white/50" />
                        <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-400 rounded-full border border-slate-900"></div>
                    </div>
                    <div>
                        <h3 className="text-white font-bold text-sm leading-none">{recipient.name}</h3>
                        <span className="text-cyan-100 text-xs flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse"></span>
                            Online
                        </span>
                    </div>
                </div>
                <div className="flex items-center gap-1">
                    <button className="p-1 hover:bg-white/10 rounded text-cyan-100"><Minus size={16} /></button>
                    <button onClick={onClose} className="p-1 hover:bg-red-500 rounded text-white"><X size={16} /></button>
                </div>
            </div>

            {/* Toolbar - Invite */}
            <div className="bg-slate-800/50 p-2 flex items-center justify-between border-b border-white/5">
                <button className="flex items-center gap-1.5 text-xs text-slate-300 hover:text-cyan-400 hover:bg-cyan-500/10 px-2 py-1 rounded transition-colors">
                    <UserPlus size={14} />
                    Convidar
                </button>
                <div className="flex gap-1">
                    <button className="p-1.5 text-slate-400 hover:text-yellow-400 hover:bg-white/5 rounded" title="Enviar Zumbido (Nudge)" onClick={handleNudge}>
                        <Zap size={14} />
                    </button>
                    <button className="p-1.5 text-slate-400 hover:text-green-400 hover:bg-white/5 rounded" title="Enviar Foto">
                        <Image size={14} />
                    </button>
                </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-950/30 custom-scrollbar">
                {messages.map((msg) => (
                    <div key={msg.id} className={`flex ${msg.sender === 'me' ? 'justify-end' : 'justify-start'}`}>
                        {msg.type === 'nudge' ? (
                            <div className="text-center w-full text-xs font-bold text-yellow-500 my-2 animate-pulse">
                                — {msg.sender === 'me' ? 'Você' : recipient.name.split(' ')[0]} enviou um Zumbido! —
                            </div>
                        ) : (
                            <div className={`max-w-[80%] rounded-2xl p-3 text-sm ${msg.sender === 'me'
                                    ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded-tr-none'
                                    : 'bg-slate-800 text-slate-200 rounded-tl-none border border-white/5'
                                }`}>
                                <p>{msg.text}</p>
                                <span className={`text-[10px] block mt-1 opacity-60 ${msg.sender === 'me' ? 'text-cyan-100' : 'text-slate-500'}`}>
                                    {msg.time}
                                </span>
                            </div>
                        )}
                    </div>
                ))}
                <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-3 bg-slate-900 border-t border-white/10">
                <div className="flex items-end gap-2 bg-slate-800/50 rounded-xl p-2 border border-white/5">
                    <button className="p-2 text-slate-400 hover:text-yellow-400 transition-colors">
                        <Smile size={20} />
                    </button>
                    <button className="p-2 text-slate-400 hover:text-cyan-400 transition-colors">
                        <Paperclip size={20} />
                    </button>
                    <textarea
                        value={inputText}
                        onChange={(e) => setInputText(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), handleSend())}
                        placeholder="Digite sua mensagem..."
                        className="flex-1 bg-transparent text-white text-sm focus:outline-none resize-none max-h-20 py-2 custom-scrollbar"
                        rows="1"
                    />
                    <motion.button
                        whileTap={{ scale: 0.9 }}
                        onClick={handleSend}
                        className="p-2 bg-cyan-500 hover:bg-cyan-400 text-white rounded-lg shadow-lg shadow-cyan-500/20 transition-all"
                    >
                        <Send size={18} />
                    </motion.button>
                </div>
            </div>
        </motion.div>
    );
};
