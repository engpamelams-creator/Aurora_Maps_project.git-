import React from 'react';
import { Link } from 'react-router-dom';
import { Map, Compass, Users, Calendar, Instagram, Linkedin, Github, Heart } from 'lucide-react';

export const Footer = () => {
    return (
        <footer className="relative mt-20 border-t border-white/10 bg-slate-900/80 backdrop-blur-xl">
            {/* Ambient Glow */}
            <div className="absolute top-0 left-1/4 w-96 h-1 bg-cyan-500/50 blur-[100px]" />

            <div className="max-w-7xl mx-auto px-6 py-12">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">

                    {/* Brand Column */}
                    <div className="space-y-4">
                        <Link to="/" className="flex items-center gap-2 group">
                            <div className="w-12 h-12 relative flex items-center justify-center transform group-hover:scale-110 transition-transform duration-300">
                                <div className="absolute inset-0 bg-cyan-500/20 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                                <img
                                    src="/aurora-logo.png"
                                    alt="Aurora Maps"
                                    className="w-full h-full object-contain drop-shadow-[0_0_8px_rgba(34,211,238,0.5)]"
                                />
                            </div>
                            <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
                                Aurora Maps
                            </span>
                        </Link>
                        <p className="text-slate-400 text-sm leading-relaxed">
                            Conectando exploradores urbanos e amantes da natureza através de experiências geolocalizadas únicas.
                        </p>
                    </div>

                    {/* Navigation Column */}
                    <div>
                        <h3 className="text-white font-bold mb-6 flex items-center gap-2">
                            Navegação
                        </h3>
                        <ul className="space-y-3">
                            <li>
                                <Link to="/feed" className="text-slate-400 hover:text-cyan-400 transition-colors flex items-center gap-2 text-sm group">
                                    <Compass size={14} className="group-hover:translate-x-1 transition-transform" /> Geo-Feed
                                </Link>
                            </li>
                            <li>
                                <Link to="/gallery" className="text-slate-400 hover:text-cyan-400 transition-colors flex items-center gap-2 text-sm group">
                                    <Map size={14} className="group-hover:translate-x-1 transition-transform" /> Galeria
                                </Link>
                            </li>
                            <li>
                                <Link to="/groups" className="text-slate-400 hover:text-cyan-400 transition-colors flex items-center gap-2 text-sm group">
                                    <Users size={14} className="group-hover:translate-x-1 transition-transform" /> Grupos
                                </Link>
                            </li>
                            <li>
                                <Link to="/events" className="text-slate-400 hover:text-cyan-400 transition-colors flex items-center gap-2 text-sm group">
                                    <Calendar size={14} className="group-hover:translate-x-1 transition-transform" /> Eventos
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Legal Column */}
                    <div>
                        <h3 className="text-white font-bold mb-6">Legal</h3>
                        <ul className="space-y-3">
                            <li><Link to="#" className="text-slate-400 hover:text-white transition-colors text-sm">Privacidade</Link></li>
                            <li><Link to="#" className="text-slate-400 hover:text-white transition-colors text-sm">Termos de Uso</Link></li>
                            <li><Link to="#" className="text-slate-400 hover:text-white transition-colors text-sm">Cookies</Link></li>
                        </ul>
                    </div>

                    {/* Social/Contact Column */}
                    <div>
                        <h3 className="text-white font-bold mb-6">Conecte-se</h3>
                        <div className="flex gap-4">
                            <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-slate-400 hover:bg-cyan-500 hover:text-white transition-all duration-300 hover:-translate-y-1">
                                <Instagram size={18} />
                            </a>
                            <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-slate-400 hover:bg-blue-600 hover:text-white transition-all duration-300 hover:-translate-y-1">
                                <Linkedin size={18} />
                            </a>
                            <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-slate-400 hover:bg-purple-600 hover:text-white transition-all duration-300 hover:-translate-y-1">
                                <Github size={18} />
                            </a>
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-slate-500 text-xs">
                        © 2024 Aurora Maps. Todos os direitos reservados.
                    </p>

                    <div className="flex items-center gap-1 text-sm font-medium text-slate-400 bg-white/5 px-4 py-2 rounded-full border border-white/5 hover:border-cyan-500/30 transition-colors">
                        <span>Desenvolvido por</span>
                        <a
                            href="https://www.devpamelams.com.br"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-cyan-400 hover:text-cyan-300 flex items-center gap-1 group relative"
                        >
                            Dev Pamela M.S
                            <Heart size={10} className="fill-cyan-500 text-cyan-500 animate-pulse" />
                            <span className="absolute -bottom-0.5 left-0 w-0 h-0.5 bg-cyan-400 group-hover:w-full transition-all duration-300" />
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    );
};
