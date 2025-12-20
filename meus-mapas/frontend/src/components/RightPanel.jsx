
import React from 'react';
import { MapPin, Users, ExternalLink, MessageCircle } from 'lucide-react';

export const RightPanel = ({ onUserSelect }) => {
    const onlineExplorers = [
        { id: 1, name: 'Ana Explorer', role: 'Level 5', avatar: 'https://ui-avatars.com/api/?name=Ana+E&background=FCD34D&color=fff' },
        { id: 2, name: 'Carlos Map', role: 'Guia Local', avatar: 'https://ui-avatars.com/api/?name=Carlos+M&background=F59E0B&color=fff' },
        { id: 3, name: 'Sarah Traveler', role: 'Level 8', avatar: 'https://ui-avatars.com/api/?name=Sarah+T&background=84CC16&color=fff' },
        { id: 4, name: 'Mike Roads', role: 'Novo', avatar: 'https://ui-avatars.com/api/?name=Mike+R&background=F97316&color=fff' },
        { id: 5, name: 'Julia Compass', role: 'Editora', avatar: 'https://ui-avatars.com/api/?name=Julia+C&background=0EA5E9&color=fff' }
    ];

    return (
        <div className="hidden xl:flex flex-col w-[300px] sticky top-24 h-[calc(100vh-120px)] gap-6">

            {/* Trending Places */}
            <div className="bg-slate-900/60 backdrop-blur-md border border-white/10 rounded-2xl p-5 shadow-lg">
                <div className="flex items-center gap-2 mb-4">
                    <div className="w-1.5 h-6 bg-gradient-to-b from-cyan-400 to-purple-500 rounded-full" />
                    <h2 className="text-lg font-bold text-white">Trending Places</h2>
                </div>
                <div className="space-y-4">
                    {[
                        { name: 'Torre Eiffel', count: '1.2k', icon: 'bg-yellow-500/20 text-yellow-400' },
                        { name: 'Times Square', count: '850', icon: 'bg-cyan-500/20 text-cyan-400' },
                        { name: 'Copacabana', count: '620', icon: 'bg-green-500/20 text-green-400' },
                        { name: 'Kyoto Temple', count: '415', icon: 'bg-pink-500/20 text-pink-400' },
                        { name: 'Machu Picchu', count: '320', icon: 'bg-yellow-600/20 text-yellow-500' },
                    ].map((place, i) => (
                        <div key={i} className="flex items-center justify-between group cursor-pointer hover:bg-white/5 p-2 rounded-xl transition-colors">
                            <div className="flex items-center gap-3">
                                <div className={`w - 10 h - 10 rounded - xl flex items - center justify - center ${place.icon} `}>
                                    <MapPin size={18} />
                                </div>
                                <div>
                                    <h3 className="font-bold text-slate-200 text-sm group-hover:text-white transition-colors">{place.name}</h3>
                                    <span className="text-xs text-slate-500">{place.count} posts hoje</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Online Explorers - Interactive */}
            <div className="bg-slate-900/60 backdrop-blur-md border border-white/10 rounded-2xl p-5 shadow-lg flex-1">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-sm font-bold text-white uppercase tracking-wider">Exploradores Online</h2>
                    <span className="bg-green-500/20 text-green-400 text-xs font-bold px-2 py-0.5 rounded">
                        {onlineExplorers.length}
                    </span>
                </div>

                <div className="space-y-1 relative">
                    {/* Connection Line */}
                    <div className="absolute left-6 top-4 bottom-4 w-0.5 bg-gradient-to-b from-slate-700/50 to-transparent -z-10" />

                    {onlineExplorers.map(user => (
                        <div
                            key={user.id}
                            onClick={() => onUserSelect && onUserSelect(user)}
                            className="flex items-center gap-3 p-2 rounded-xl hover:bg-white/5 cursor-pointer transition-all group relative"
                        >
                            <div className="relative">
                                <img src={user.avatar} alt={user.name} className="w-10 h-10 rounded-full border-2 border-slate-700 group-hover:border-cyan-500 transition-colors" />
                                <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-slate-900 animate-pulse" />
                            </div>
                            <div>
                                <h3 className="text-sm font-bold text-slate-200 group-hover:text-cyan-400 transition-colors">{user.name}</h3>
                                <div className="text-xs text-slate-500 flex items-center gap-1">
                                    {user.id === 1 && <span className="w-1.5 h-1.5 bg-yellow-500 rounded-full" />}
                                    {user.role}
                                </div>
                            </div>

                            {/* Hover Chat Icon */}
                            <div className="absolute right-2 opacity-0 group-hover:opacity-100 transition-opacity transform translate-x-2 group-hover:translate-x-0">
                                <div className="p-2 bg-cyan-500 rounded-full shadow-lg">
                                    <MessageCircle size={14} className="text-white" />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};
