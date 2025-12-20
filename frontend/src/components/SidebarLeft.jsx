import React from 'react';
import { User, Map, Users, Calendar, Settings, Compass } from 'lucide-react';
import { WeatherWidget } from './WeatherWidget';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const NavItem = ({ icon: Icon, label, to = "#", active }) => (
    <Link
        to={to}
        className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group ${active
            ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20'
            : 'text-slate-400 hover:bg-white/5 hover:text-white hover:border hover:border-white/5'
            }`}
    >
        <Icon size={20} className={`transition-transform duration-300 group-hover:scale-110 ${active ? 'fill-cyan-500/20' : ''}`} />
        <span className="font-medium">{label}</span>
    </Link>
);

export const SidebarLeft = () => {
    const { user } = useAuth();
    const userName = user?.name || "Meu Perfil";

    return (
        <div className="hidden lg:flex flex-col w-[280px] sticky top-24 h-[calc(100vh-120px)] overflow-y-auto pr-2 custom-scrollbar">
            <WeatherWidget />

            <nav className="space-y-2">
                <div className="px-2 mb-2">
                    <Link to="/profile" className="flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-300 hover:bg-white/5 group border border-transparent hover:border-white/5">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-cyan-400 to-purple-600 p-[2px] shadow-lg shadow-purple-500/20 group-hover:scale-105 transition-transform">
                            <div className="w-full h-full rounded-full bg-slate-900 overflow-hidden flex items-center justify-center">
                                {user?.avatar ? (
                                    <img src={user.avatar} alt={userName} className="w-full h-full object-cover" />
                                ) : (
                                    <User size={20} className="text-white" />
                                )}
                            </div>
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="font-bold text-sm text-white truncate group-hover:text-cyan-400 transition-colors">{userName}</p>
                            <p className="text-xs text-slate-500 truncate">Ver Perfil</p>
                        </div>
                    </Link>
                </div>
                {/* <NavItem icon={User} label={userName} to="/profile" /> Removed generic User item in favor of custom Avatar item */}
                <NavItem icon={Compass} label="Geo-Feed" to="/feed" />
                <NavItem icon={Map} label="Explorar Mapa" to="/" />
                <NavItem icon={Users} label="Grupos Próximos" to="/groups" />
                <NavItem icon={Calendar} label="Eventos Locais" to="/events" />
            </nav>

            <div className="mt-8 pt-6 border-t border-white/10">
                <h4 className="px-4 text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">Atalhos</h4>
                <nav className="space-y-2 opacity-80">
                    <NavItem icon={Settings} label="Configurações" />
                </nav>
            </div>
        </div>
    );
};
