import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export const AIChatWidget = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { role: 'assistant', text: 'Olá! Sou a Aurora AI. Pergunte sobre lugares ou peça dicas de viagem! 🗺️' }
    ]);
    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(scrollToBottom, [messages]);

    const handleSend = async () => {
        if (!input.trim()) return;

        const userMsg = { role: 'user', text: input };
        setMessages(prev => [...prev, userMsg]);
        setInput('');
        setIsTyping(true);

        try {
            // Direct call to AI Microservice (Cloud-Native Lite)
            const response = await fetch('http://localhost:8001/rag/ask', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ question: userMsg.text })
            });
            const data = await response.json();

            const replyText = data.answer || "Ops, meu cérebro RAG está offline. Configure a OPENAI_API_KEY no .env do backend!";

            setMessages(prev => [...prev, { role: 'assistant', text: replyText }]);
        } catch (error) {
            setMessages(prev => [...prev, { role: 'assistant', text: "Erro ao conectar com a IA. O container 'aurora-maps-ai' está rodando?" }]);
        } finally {
            setIsTyping(false);
        }
    };

    return (
        <>
            {/* Toggle Button */}
            <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setIsOpen(!isOpen)}
                className={`fixed bottom-6 right-6 z-50 p-4 rounded-full shadow-lg backdrop-blur-md border border-white/20 transition-all duration-300 ${isOpen ? 'bg-red-500/80 rotate-45' : 'bg-gradient-to-r from-cyan-500 to-purple-500'}`}
            >
                {isOpen ? (
                    <span className="text-2xl">➕</span> // Rotated plus is close
                ) : (
                    <img
                        src="/aurora-ai-icon.png"
                        alt="Aurora AI"
                        className="w-12 h-12 object-cover rounded-full"
                    />
                )}
            </motion.button>

            {/* Chat Window */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 50, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 50, scale: 0.9 }}
                        className="fixed bottom-24 right-6 z-50 w-80 md:w-96 h-[500px] bg-slate-900/90 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl flex flex-col overflow-hidden"
                    >
                        {/* Header */}
                        <div className="p-4 bg-gradient-to-r from-cyan-900/50 to-purple-900/50 border-b border-white/10 flex items-center gap-3">
                            <img src="/aurora-ai-icon.png" alt="AI" className="w-8 h-8 rounded-full border border-cyan-400" />
                            <h3 className="font-bold text-white">Aurora Assistant</h3>
                        </div>

                        {/* Messages Area */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-white/10">
                            {messages.map((msg, idx) => (
                                <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                    <div className={`max-w-[80%] p-3 rounded-2xl text-sm ${msg.role === 'user'
                                        ? 'bg-cyan-600/20 text-cyan-100 border border-cyan-500/30 rounded-br-none'
                                        : 'bg-white/5 text-gray-200 border border-white/10 rounded-bl-none'
                                        }`}>
                                        {msg.text}
                                    </div>
                                </div>
                            ))}
                            {isTyping && (
                                <div className="flex justify-start">
                                    <div className="bg-white/5 p-3 rounded-2xl rounded-bl-none flex gap-1 items-center">
                                        <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"></div>
                                        <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce delay-75"></div>
                                        <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce delay-150"></div>
                                    </div>
                                </div>
                            )}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Input Area */}
                        <div className="p-3 border-t border-white/10 bg-black/20">
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                                    placeholder="Pergunte algo..."
                                    className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-cyan-500/50 transition-colors"
                                />
                                <button
                                    onClick={handleSend}
                                    className="p-2 bg-cyan-500/20 hover:bg-cyan-500/40 text-cyan-400 rounded-xl transition-colors"
                                >
                                    ➤
                                </button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};
